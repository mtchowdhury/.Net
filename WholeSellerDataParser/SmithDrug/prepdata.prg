* data prep for MorrisDickson
CLOSE DATA
CLEAR

USE holding EXCLU
ZAP
infile =GETFILE('txt','SmithDrug','import',0,'')
DO WHILE !EMPTY(infile)
	APPEND FROM [&infile] SDF
	infile =GETFILE('txt','SmithDrug','import',0,'')
ENDDO
IF EOF()
	USE
	CANCEL
ENDIF

IF FILE('unknown.dbf')
	APPEND FROM unknown
ENDIF

replace all ndc with CHRTRAN(ndc,'-','') for '-'$ndc
replace all ndc with RIGHT('00000000000'+alltrim(ndc),11), ;
            prod_size with alltrim(prod_size), ;
            prod_strng with alltrim(prod_strng), ;
            invoice WITH ALLTRIM(invoice), ;
            fac_acct WITH ALLTRIM(fac_acct), ;
            ve_itemnr WITH ALLTRIM(ve_itemnr) ;
            for not deleted()

replace all ;
	inv_date with ctod(left(alltrim(idate),2)+'/'+substr(alltrim(idate),3,2)+'/'+right(alltrim(idate),4)), ;
	ship_date with ctod(left(alltrim(sdate),2)+'/'+substr(alltrim(sdate),3,2)+'/'+right(alltrim(sdate),4))
replace all rec_date with IIF(EMPTY(inv_date),ship_date,inv_date)

replace ALL ship_qty WITH VAL(cqty), ;
			cost WITH VAL(ccost), ;
			wac WITH VAL(cwac), ;
			tot_cost WITH IIF(ship_qty<0 AND !'-'$ctotal,0-VAL(ctotal),VAL(ctotal))

m.wrpid = 36
replace ALL wrpid WITH m.wrpid, ;
            wholesaler with 'SmithDrug', ;
            whid WITH 118

sqlh=SQLSTRINGCONNECT("DRIVER=SQL Server;SERVER=armsqlprddb;DATABASE=cps;Trusted_Connection=Yes")
? SQLEXEC(sqlh,"select mm_mmid, mm_dea, mm_olddea from members order by mm_mmid desc","mm")
? SQLEXEC(sqlh,"select mw_mmid, mw_whid, mw_account from memberwholesalers, wholesalers where mw_whid=wh_whid and wh_rpid="+STR(m.wrpid)+" order by mw_mmid desc","mw")
? SQLEXEC(sqlh,"select it_ndc, it_upc, it_oldndc, it_itid, coalesce(it_discont,0) it_discont, coalesce(it_vnumber,'') it_vnumber from items where it_itid<>174565","it")
*? SQLEXEC(sqlh,"select * from contracts where co_cmid<>2","co")
*? SQLEXEC(sqlh,"select xw_contract, xw_coid, co_start, co_end, xw_end from cps..xrefWholesalerContract, cps..contracts where xw_coid=co_coid and xw_rpid="+STR(m.wrpid),"xwco")
? SQLEXEC(sqlh,"select co_vendor xw_contract, co_coid xw_coid, co_start, co_end, CAST(null as datetime) xw_end from cps..contracts","xwco")
=SQLDISCONNECT(sqlh)

SELECT mm
INDEX ON mm_dea TO c:\temp\temp COMPACT FOR mm_dea<>' '
SELECT holding
SET RELATION TO LEFT(fac_dea,9) INTO mm
REPLACE ALL mmid WITH VAL(mm.mm_mmid)
SELE mm
INDEX ON LEFT(mm_olddea,9) TO c:\temp\temp3 COMPACT FOR mm_olddea<>' '
SELE holding
SET RELATION TO LEFT(fac_dea,9) INTO mm
REPLACE ALL mmid WITH VAL(mm.mm_mmid) FOR mmid=0 AND VAL(mm.mm_mmid)<>0
SELE mw
INDEX ON LEFT(mw_account,10) TO c:\temp\temp COMPACT FOR !EMPTY(mw_account)
SELE holding
SET RELATION TO LEFT(fac_acct,10) INTO mw
REPLACE ALL mmid WITH VAL(mw.mw_mmid) FOR EMPTY(mmid)
SET RELATION TO

SELE it
INDEX ON LEFT(it_oldndc,11)+LEFT(it_vnumber,12)+STR(it_discont) TO c:\temp\temp2 COMPACT FOR it_oldndc<>' '
SELE holding
SET RELATION TO LEFT(ndc,11)+ve_itemnr INTO it
REPLACE ALL itid WITH VAL(it.it_itid) FOR VAL(it.it_itid)>0 AND itid=0
SET RELATION TO LEFT(ndc,11) INTO it
REPLACE ALL itid WITH VAL(it.it_itid) FOR VAL(it.it_itid)>0 AND itid=0
SELE it
INDEX ON LEFT(it_ndc,11)+LEFT(it_vnumber,12)+STR(it_discont) TO c:\temp\temp2 FOR it_ndc<>' '
SELE holding
SET RELATION TO LEFT(ndc,11)+ve_itemnr INTO it
REPLACE ALL itid WITH VAL(it.it_itid) FOR VAL(it.it_itid)>0 AND itid=0
SET RELATION TO LEFT(ndc,11) INTO it
REPLACE ALL itid WITH VAL(it.it_itid) FOR VAL(it.it_itid)>0 AND itid=0
SELE it
INDEX ON LEFT(it_upc,12)+LEFT(it_vnumber,12)+STR(it_discont) TO c:\temp\temp2 FOR it_upc<>' '
SELE holding
SET RELATION TO LEFT(upc,12)+ve_itemnr INTO it
REPLACE ALL itid WITH VAL(it.it_itid) FOR VAL(it.it_itid)>0 AND itid=0
SET RELATION TO LEFT(upc,12) INTO it
REPLACE ALL itid WITH VAL(it.it_itid) FOR VAL(it.it_itid)>0 AND itid=0
SET RELATION TO

REPLACE ALL wh_cont WITH STRTRAN(contract,'-','') FOR sale_cr<>'O'
LOCATE FOR wh_cont='0'
DO WHILE !EOF()
	REPLACE ALL wh_cont WITH SUBSTR(wh_cont,2) FOR wh_cont='0'
	LOCATE FOR wh_cont='0'
ENDDO

* match on wholesaler xref to match contract number (first)
SELECT UPPER(xw_contract) as xw_contract, VAL(xw_coid) AS xw_coid, TTOD(co_start) AS co_start, TTOD(co_end) AS co_end, TTOD(xw_end) AS xw_end ;
	INTO CURSOR whcx ;
	FROM xwco
SELECT 0
USE (DBF('whcx')) AGAIN ALIAS whcontxref
USE IN whcx
REPLACE ALL xw_contract WITH STRTRAN(xw_contract,'-','')
LOCATE FOR xw_contract='0'
DO WHILE !EOF()
	REPLACE ALL xw_contract WITH SUBSTR(xw_contract,2) FOR xw_contract='0'
	LOCATE FOR xw_contract='0'
ENDDO
SELECT holding
SCAN FOR sale_cr='C' AND !EMPTY(wh_cont) AND !ISNULL(wh_cont) AND EMPTY(match_coid)
	m.wh_cont = UPPER(LEFT(holding.wh_cont,15))
	SELECT whcontxref
	LOCATE FOR LEFT(xw_contract,15)=m.wh_cont AND BETWEEN(holding.rec_date,co_start,co_end) AND (ISNULL(xw_end) OR xw_end>holding.rec_date)
	IF FOUND()
		REPLACE holding.match_coid WITH whcontxref.xw_coid, ;
			holding.extra WITH 'whxref', ;
			holding.match_type WITH 'A' IN holding
		LOOP
	ENDIF
	LOCATE FOR LEFT(xw_contract,15)=m.wh_cont AND holding.rec_date<co_start AND (ISNULL(xw_end) OR xw_end>holding.rec_date)
	IF FOUND()
		REPLACE holding.match_coid WITH whcontxref.xw_coid, ;
			holding.extra WITH 'whxref', ;
			holding.match_type WITH 'F' IN holding
		LOOP
	ENDIF
	LOCATE FOR LEFT(xw_contract,15)=m.wh_cont AND holding.rec_date>co_end AND (ISNULL(xw_end) OR xw_end>holding.rec_date)
	IF FOUND()
		REPLACE holding.match_coid WITH whcontxref.xw_coid, ;
			holding.extra WITH 'whxref', ;
			holding.match_type WITH 'P' IN holding
		LOOP
	ENDIF
ENDSCAN

***************************************************
*!*	SELECT VAL(co_coid) AS co_coid, co_vendor, UPPER(co_vendor) AS cont_nr, UPPER(co_alternate) AS alt_cont, co_start, co_end ;
*!*		INTO CURSOR com ;
*!*		FROM co
*!*	SELECT 0
*!*	USE (DBF('com')) AGAIN ALIAS contmatch
*!*	USE IN com
*!*	REPLACE ALL cont_nr WITH STRTRAN(cont_nr,'-','') FOR NOT ISNULL(cont_nr)
*!*	LOCATE FOR cont_nr='0'
*!*	DO WHILE !EOF()
*!*		REPLACE ALL cont_nr WITH SUBSTR(cont_nr,2) FOR cont_nr='0'
*!*		LOCATE FOR cont_nr='0'
*!*	ENDDO
*!*	INDEX ON LEFT(cont_nr,15)+DTOS(co_start) TAG cont_nr
*!*	REPLACE ALL alt_cont WITH STRTRAN(alt_cont,'-','') FOR NOT ISNULL(alt_cont)
*!*	LOCATE FOR alt_cont='0'
*!*	DO WHILE !EOF()
*!*		REPLACE ALL alt_cont WITH SUBSTR(alt_cont,2) FOR alt_cont='0'
*!*		LOCATE FOR alt_cont='0'
*!*	ENDDO
*!*	INDEX ON LEFT(alt_cont,15)+DTOS(co_start) TAG alt_cont
*!*	SET ORDER TO

USE ("\\armclstrfs\Sales Data\Wholesaler Data\coit.dbf") ALIAS contmatch IN 0

SELE holding
SCAN FOR INLIST(sale_cr,'C','O') AND !EMPTY(wh_cont) AND !ISNULL(wh_cont) AND EMPTY(match_coid) AND !EMPTY(itid)
	m.wh_cont = UPPER(LEFT(holding.wh_cont,15))
	m.itid = holding.itid
	SELECT contmatch
	LOCATE FOR LEFT(cont_nr,15)=m.wh_cont AND pr_itid=m.itid AND BETWEEN(holding.rec_date,co_start,co_end)
	IF FOUND()
		REPLACE holding.match_coid WITH contmatch.co_coid, ;
			holding.extra WITH 'co_vendor', ;
			holding.match_type WITH 'A' IN holding
		LOOP
	ENDIF
	LOCATE FOR LEFT(alt_cont,15)=m.wh_cont AND pr_itid=m.itid AND BETWEEN(holding.rec_date,co_start,co_end)
	IF FOUND()
		REPLACE holding.match_coid WITH contmatch.co_coid, ;
			holding.extra WITH 'alternate', ;
			holding.match_type WITH 'A' IN holding
		LOOP
	ENDIF
	LOCATE FOR LEFT(cont_nr,15)=m.wh_cont AND pr_itid=m.itid AND holding.rec_date<co_start
	IF FOUND()
		REPLACE holding.match_coid WITH contmatch.co_coid, ;
			holding.extra WITH 'co_vendor', ;
			holding.match_type WITH 'F' IN holding
		LOOP
	ENDIF
	LOCATE FOR LEFT(alt_cont,15)=m.wh_cont AND pr_itid=m.itid AND holding.rec_date<co_start
	IF FOUND()
		REPLACE holding.match_coid WITH contmatch.co_coid, ;
			holding.extra WITH 'alternate', ;
			holding.match_type WITH 'F' IN holding
		LOOP
	ENDIF
	LOCATE FOR LEFT(cont_nr,15)=m.wh_cont AND pr_itid=m.itid AND holding.rec_date>co_end
	IF FOUND()
		REPLACE holding.match_coid WITH contmatch.co_coid, ;
			holding.extra WITH 'co_vendor', ;
			holding.match_type WITH 'P' IN holding
		LOOP
	ENDIF
	LOCATE FOR LEFT(alt_cont,15)=m.wh_cont AND pr_itid=m.itid AND holding.rec_date>co_end
	IF FOUND()
		REPLACE holding.match_coid WITH contmatch.co_coid, ;
			holding.extra WITH 'alternate', ;
			holding.match_type WITH 'P' IN holding
		LOOP
	ENDIF
ENDSCAN

btime=TTOC(DATETIME(),3)
REPLACE ALL BATCH WITH btime, ;
			sale_crw WITH sale_cr, ;
			sale_crsrc WITH 'O'
