using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace persol_poc_hustler.DvelopService
{
    public class FileHandlers
    {
        private static string MEDIA_TYPE_HAL_JSON = "application/hal+json";
        private static string MEDIA_TYPE_OCTET_STREAM = "application/octet-stream";

        public static IConfiguration Configuration { get; set; }
        public FileHandlers(IConfiguration configuration)
        {
            Configuration = configuration;
        }


        //upload file in a whole
        public async Task<string> UploadFile(string baseURI, string sessionId, string repoId, string filePath, string uploadMappingFile)
        {
            var contentLocationUri = "/dms/r/" + repoId + "/blob/chunk";

            //first: upload file and get an URI (contentLocationUri) as a reference to this file
            contentLocationUri = await UploadFileChunk(baseURI, sessionId, contentLocationUri, filePath).ConfigureAwait(false); ;

            //second: upload metadata with reference URI (contentLocationUri).
            var documentLink = await FinishFileUpload(baseURI, sessionId, repoId, contentLocationUri, filePath, uploadMappingFile).ConfigureAwait(false); ;
            if (null != documentLink)
            {
                return documentLink;
            }
            return string.Empty;
        }

        //upload file in chunks
        public async static Task<string> UploadFileChunked(string baseURI, string sessionId, string repoId, string filePath, string uploadMappingFile)
        {
            var path = Path.GetDirectoryName(filePath);
            var name = Path.GetFileNameWithoutExtension(filePath);
            var contentLocationUri = "/dms/r/" + repoId + "/blob/chunk";
            var index = 0;
            var chunkFilePath = Path.Combine(path, name + index);

            //first: upload file and get an URI (contentLocationUri) as a reference to this file
            while (File.Exists(chunkFilePath))
            {
                contentLocationUri = await UploadFileChunk(baseURI, sessionId, contentLocationUri, chunkFilePath).ConfigureAwait(false); ;
                chunkFilePath = Path.Combine(path, name + ++index);
            }

            //second: upload metadata with reference URI (contentLocationUri).
            var documentLink = await FinishFileUpload(baseURI, sessionId, repoId, contentLocationUri, filePath, uploadMappingFile).ConfigureAwait(false); ;
            if (null != documentLink)
            {
                return documentLink;
            }

            return string.Empty;
        }


        public async static Task<string> UploadFileChunk(string baseURI, string sessionId, string link_relation, string chunkFilePath)
        {
            var baseRequest = baseURI + link_relation;


            using (HttpClient client = new HttpClient())
            {
                //set Origin header to avoid conflicts with same origin policy
                client.BaseAddress = new System.Uri(baseURI);
                client.DefaultRequestHeaders.Add("Origin", baseURI);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", sessionId);

                //set data content type
                StreamContent data = new StreamContent(new FileStream(chunkFilePath, FileMode.Open, FileAccess.Read, FileShare.Read));
                data.Headers.ContentType = new MediaTypeWithQualityHeaderValue(MEDIA_TYPE_OCTET_STREAM);

                var result = await client.PostAsync(link_relation, data).ConfigureAwait(false);
                if (result.IsSuccessStatusCode)
                {
                    Console.WriteLine("uploadchunk ok: " + baseRequest);
                    var response = result.Headers.Location;
                    if (null != response)
                    {
                        return response.ToString();
                    }
                    else
                    {
                        return link_relation;
                    }
                }
            }
            return String.Empty;
        }


        public static async Task<string> FinishFileUpload(string baseURI, string sessionId, string repoId, string contentLocationUri, string filePath, string uploadMappingFile)
        {
            var link_relation = "/dms/r/" + repoId + "/o2m";
            var baseRequest = baseURI + link_relation;
            var sourceId = $"{Configuration["DvelopInfos:sourceId"]}";

            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new System.Uri(baseURI);
                client.DefaultRequestHeaders.Add("Origin", baseURI);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", sessionId);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MEDIA_TYPE_HAL_JSON));

                //read mapping and replace content location uri and source Id
                var output = uploadMappingFile.Replace("<to be replaced>", contentLocationUri);
                output = output.Replace("<source to be replaced>", sourceId);

                StringContent data = new StringContent(output);
                data.Headers.ContentType = new MediaTypeWithQualityHeaderValue(MEDIA_TYPE_HAL_JSON);

                var result = await client.PostAsync(link_relation, data).ConfigureAwait(false);
                if (result.IsSuccessStatusCode)
                {
                    Console.WriteLine("upload ok: " + baseRequest);
                    return result.Headers.Location.ToString();
                }
                else
                {
                    Console.WriteLine("upload failed: " + baseRequest);
                    return String.Empty;
                }
            }
        }

    }
}
