using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Threading.Tasks;

namespace AppyController.Models
{
    public class MetaDataMap
    {
        public string filename { get; set; }
        public string sourceCategory { get; set; } = "2d0d6593-9391-4e9e-a95a-9a28ce3a901c";
        public string sourceId { get; set; } = "/dms/r/73215d3a-ea55-4555-9817-9fb1d79abc59/source";
        public string contentLocationUri { get; set; } = "/dms/r/73215d3a-ea55-4555-9817-9fb1d79abc59/source";

        public sourceProperties sourceProperties { get; set; }

    }

    public class sourceProperties
    {
        public IEnumerable<object> properties { get; set; }

    }

}
