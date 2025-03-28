const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#87d068", "#108ee9", "#f50", "#2db7f5"]

function guidToNumber(guid: string) {
  return parseInt(guid.replace(/-/g, "").slice(0, 4) || "0", 16)
}

export function getColorById(id: string) {
  return colors[guidToNumber(id) % colors.length]
}
