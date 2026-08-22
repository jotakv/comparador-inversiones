export{formatCurrency as euro,formatPercent as pct,formatMultiple,formatYears,mountShell,kpiCard,panel,badge,tooltip}from'./ui.js';
export const load=async path=>{const response=await fetch(path);if(!response.ok)throw new Error(`No se pudo cargar ${path}`);return response.json()};
export function table(rows,columns,{className=''}={}){
  if(!rows.length)return'<div class="empty">No hay datos disponibles.</div>';
  return`<div class="table-wrap ${className}"><table><thead><tr>${columns.map(c=>`<th>${c.label||c[0]}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${columns.map(c=>`<td class="${c.className?c.className(row):''}">${(c.render||c[1])(row)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
