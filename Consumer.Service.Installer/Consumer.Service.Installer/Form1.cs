using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Consumer.Service.Installer
{
    public partial class ConsumerInstaller : Form
    {
        public ConsumerInstaller()
        {
            InitializeComponent();
        }
        private void Install(string action)
        {
            var proc = new Process();
            proc.StartInfo.FileName = "AMBS.Conso.Consumer.Service.exe"; // move to app.config
            proc.StartInfo.Arguments = action;
            proc.Start();
            proc.WaitForExit();
            var exitCode = proc.ExitCode;
            proc.Close();
        }

        private void btnProceed_Click(object sender, EventArgs e)
        {
            try
            {
                var command = ddlActions.Text;
                if (command == "Select")
                {
                    MessageBox.Show("Please select an action.");
                    return;
                }
                var action = "-" + ddlActions.Text.ToString().ToLower();
                var connString = txtConStr.Text.Trim();
                var writeSuccess = WriteConnectionString(connString);
                if (!writeSuccess)
                {
                    MessageBox.Show(
                        "Unable to override connection string. Please check folder write permission or launch thie app in admin mode!");
                    return;
                }
                Install(action);
                MessageBox.Show("process completed and service started successfully.");
            }
            catch (Exception exception)
            {
                MessageBox.Show("Error: " + exception.Message);
            }
          
        }

        private static bool WriteConnectionString(string newConnStr)
        {
            try
            {
                var filePath = Application.StartupPath + "/AMBS.Conso.Consumer.Service.exe.config"; // move to app.config
                string text = File.ReadAllText(filePath);
                text = text.Replace("connstring", newConnStr);
                File.WriteAllText(filePath, text);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
           
        }

        private void richTextBox1_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
