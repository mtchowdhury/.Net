
namespace Consumer.Service.Installer
{
    partial class ConsumerInstaller
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.ddlActions = new System.Windows.Forms.ComboBox();
            this.txtConStr = new System.Windows.Forms.RichTextBox();
            this.btnProceed = new System.Windows.Forms.Button();
            this.richTextBox1 = new System.Windows.Forms.RichTextBox();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(50, 68);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(54, 20);
            this.label1.TabIndex = 0;
            this.label1.Text = "Action";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(50, 128);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(132, 20);
            this.label2.TabIndex = 1;
            this.label2.Text = "ConnectionString";
            // 
            // ddlActions
            // 
            this.ddlActions.FormattingEnabled = true;
            this.ddlActions.Items.AddRange(new object[] {
            "Install",
            "Uninstall"});
            this.ddlActions.Location = new System.Drawing.Point(224, 68);
            this.ddlActions.Name = "ddlActions";
            this.ddlActions.Size = new System.Drawing.Size(121, 28);
            this.ddlActions.TabIndex = 2;
            this.ddlActions.Text = "Select";
            // 
            // txtConStr
            // 
            this.txtConStr.Location = new System.Drawing.Point(224, 128);
            this.txtConStr.Name = "txtConStr";
            this.txtConStr.Size = new System.Drawing.Size(543, 153);
            this.txtConStr.TabIndex = 3;
            this.txtConStr.Text = "";
            // 
            // btnProceed
            // 
            this.btnProceed.Location = new System.Drawing.Point(54, 390);
            this.btnProceed.Name = "btnProceed";
            this.btnProceed.Size = new System.Drawing.Size(149, 48);
            this.btnProceed.TabIndex = 4;
            this.btnProceed.Text = "Proceed";
            this.btnProceed.UseVisualStyleBackColor = true;
            this.btnProceed.Click += new System.EventHandler(this.btnProceed_Click);
            // 
            // richTextBox1
            // 
            this.richTextBox1.Location = new System.Drawing.Point(224, 304);
            this.richTextBox1.Name = "richTextBox1";
            this.richTextBox1.ReadOnly = true;
            this.richTextBox1.Size = new System.Drawing.Size(543, 96);
            this.richTextBox1.TabIndex = 5;
            this.richTextBox1.Text = "Connection String format: Data Source=ServerName;Initial Catalog=DBNAME;Timeout=1" +
    "200000;Persist Security Info=True;User ID=sa;Password=yourpassword;";
            this.richTextBox1.TextChanged += new System.EventHandler(this.richTextBox1_TextChanged);
            // 
            // ConsumerInstaller
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 20F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.richTextBox1);
            this.Controls.Add(this.btnProceed);
            this.Controls.Add(this.txtConStr);
            this.Controls.Add(this.ddlActions);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Name = "ConsumerInstaller";
            this.Text = "ConsumerInstaller";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.ComboBox ddlActions;
        private System.Windows.Forms.RichTextBox txtConStr;
        private System.Windows.Forms.Button btnProceed;
        private System.Windows.Forms.RichTextBox richTextBox1;
    }
}

