SELECT 0
SELECT fac_name,fac_dea,fac_acct,COUNT(*) records,SUM(cost*ship_qty) dollars,MIN(rec_date) min_date,MAX(rec_date) max_date ;
	INTO CURSOR tUnknown FROM unknown ;
	GROUP BY fac_name,fac_dea,fac_acct ORDER BY records desc,fac_name,fac_dea
COPY TO unknown.xls TYPE xl5
USE
