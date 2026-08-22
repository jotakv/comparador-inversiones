export const SCENARIOS=['pessimistic','base','optimistic'];
export const scenarioLabels={pessimistic:'Pesimista',base:'Base',optimistic:'Optimista'};
export function readScenario(url=globalThis.location?.href,storage=globalThis.localStorage){
  const query=url?new URL(url).searchParams.get('scenario'):null;
  return SCENARIOS.includes(query)?query:(SCENARIOS.includes(storage?.getItem('idl-scenario'))?storage.getItem('idl-scenario'):'base');
}
export function setScenario(value){
  if(!SCENARIOS.includes(value))return;
  localStorage.setItem('idl-scenario',value);
  const url=new URL(location.href);url.searchParams.set('scenario',value);history.replaceState({},'',url);
  window.dispatchEvent(new CustomEvent('scenariochange',{detail:value}));
  location.reload();
}
