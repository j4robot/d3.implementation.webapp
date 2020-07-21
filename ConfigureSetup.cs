using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MenuManager
{
    public class ConfigureSetup
    {

        public static ConfigureSetup Current;

        public ConfigureSetup()
        {
            Current = this;
        }

        public string Authority { get; set; }
        public string HCMMenuBuilderMicroservice { get; set; }
        public string HCMMenuBuilderCoreAPI { get; set; }
    }
}
