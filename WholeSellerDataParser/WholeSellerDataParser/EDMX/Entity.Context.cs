﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WholeSellerDataParser.EDMX
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class AnalyticsEntities : DbContext
    {
        public AnalyticsEntities()
            : base("name=AnalyticsEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<SmithDrug> SmithDrugs { get; set; }
        public virtual DbSet<ValueDrug> ValueDrugs { get; set; }
        public virtual DbSet<Cardinal> Cardinals { get; set; }
        public virtual DbSet<Dakota> Dakotas { get; set; }
        public virtual DbSet<Amerisource> Amerisources { get; set; }
        public virtual DbSet<NcMutual> NcMutuals { get; set; }
        public virtual DbSet<BioCare> BioCares { get; set; }
    
        public virtual ObjectResult<UpdateCalculatedColumns_Result> UpdateCalculatedColumns()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<UpdateCalculatedColumns_Result>("UpdateCalculatedColumns");
        }
    }
}
