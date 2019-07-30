SELECT 0
USE holding EXCLUSIVE
INDEX on fac_name+fac_dea+fac_acct TAG fff FOR mmid=0 unique
IF EOF()
	USE
	RETURN
ENDIF
COPY TO tempFac
USE tempFac IN 0
INDEX on fac_name+fac_dea+fac_acct TAG fff

*!*	SELECT 0
*!*	CREATE CURSOR identified ( ;
*!*		fac_name c(50),fac_dea c(10),fac_hin c(10),fac_city c(25),fac_state c(2),fac_acct c(10),records i,mmid i)
SELECT fac_name,fac_dea,fac_acct,CAST(0 as int) as records,CAST(0 as int) as mmid INTO CURSOR identified ;
	FROM tempFac WHERE 1=2 READWRITE
APPEND FROM Identified.xls TYPE XL5 FOR mmid>0

SCAN
	lhold = RECNO()
WAIT WINDOW 'locate'+STR(lhold) nowait
	SELECT tempFac
	GO TOP
	LOCATE FOR tempFac.fac_name+tempFac.fac_dea+tempFac.fac_acct= ;
				identified.fac_name+identified.fac_dea+identified.fac_acct
	IF !EOF()
WAIT WINDOW 'replace'+STR(lhold) nowait
		SELECT holding
		replace mmid WITH identified.mmid ;
			FOR holding.fac_name+holding.fac_dea+holding.fac_acct= ;
				identified.fac_name+identified.fac_dea+identified.fac_acct ;
			AND mmid=0
	ENDIF
ENDSCAN
WAIT CLEAR

*!*	SCAN
*!*		SELECT holding
*!*		LOCATE FOR mmid=0
*!*		IF EOF()
*!*			EXIT
*!*		ENDIF
*!*		SELECT identified
*!*		replace holding.mmid WITH identified.mmid ;
*!*			FOR holding.mmid=0 ;
*!*			AND holding.fac_name+holding.fac_dea+holding.fac_hin+holding.fac_city+holding.fac_state+holding.fac_acct= ;
*!*				identified.fac_name+identified.fac_dea+identified.fac_hin+identified.fac_city+identified.fac_state+identified.fac_acct ;
*!*			IN holding
*!*	ENDSCAN
USE IN identified
USE IN holding
USE IN tempFac
DELETE FILE tempFac.dbf
