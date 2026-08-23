export const CAPITAL_AVAILABLE=45000;

export const AGUILAS_ENTRY={
  itpRate:.08,
  scenarios:{
    low:{purchasePrice:33000,agencyFee:0,agencyVat:0,notary:600,registry:300,administration:150,documentation:20,technicalPrecheck:450},
    base:{purchasePrice:35000,agencyFee:661,agencyVat:139,notary:750,registry:450,administration:250,documentation:30,technicalPrecheck:700},
    high:{purchasePrice:38000,agencyFee:1240,agencyVat:260,notary:900,registry:600,administration:400,documentation:50,technicalPrecheck:1100}
  },
  futureCapex:{low:19700,base:23700,high:31500}
};

export function entryMetrics(scenario='base'){
  const s=AGUILAS_ENTRY.scenarios[scenario];
  const itp=s.purchasePrice*AGUILAS_ENTRY.itpRate;
  const agency=s.agencyFee+s.agencyVat;
  const closingCosts=itp+agency+s.notary+s.registry+s.administration+s.documentation;
  const entryCost=s.purchasePrice+closingCosts+s.technicalPrecheck;
  const futureCapex=AGUILAS_ENTRY.futureCapex[scenario];
  return{...s,itp,agency,closingCosts,entryCost,futureCapex,projectCost:entryCost+futureCapex,liquidity:Math.max(0,CAPITAL_AVAILABLE-entryCost),fundingGap:Math.max(0,entryCost-CAPITAL_AVAILABLE),capitalUsed:entryCost/CAPITAL_AVAILABLE};
}
