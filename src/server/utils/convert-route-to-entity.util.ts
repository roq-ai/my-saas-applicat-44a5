const mapping: Record<string, string> = {
  'calculated-results': 'calculated_result',
  'calculation-formulas': 'calculation_formula',
  companies: 'company',
  'team-members': 'team_member',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
