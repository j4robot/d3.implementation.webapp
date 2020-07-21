using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MenuManager.Models;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Hosting;
using AppyController.Models;
using System.Text;
using System.IO;
using AppyController.DvelopService;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;

namespace MenuManager.Controllers
{
    public class HomeController : Controller
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<HomeController> _logger;
        public IConfiguration Configuration { get; set; }

        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment env, IConfiguration configuration)
        {
            _logger = logger;
            _env = env;
            Configuration = configuration;
        }


        public IActionResult Index()
        {
            //clearFolder();
            return View();
        }


        public IActionResult Dashboard()
        {
            return View();
        }

        public IActionResult Projects()
        {
            return View();
        }
        public IActionResult Applications()
        {
            return View();
        }
        public IActionResult Menus()
        {
            return View();
        }

        public IActionResult Language()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
