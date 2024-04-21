export interface WhereEqualCondition {
	where: string;
	equals: string | number;
}

export function appendQueryCondition(statement: string, conditions: WhereEqualCondition[]): string {
	if (conditions.length === 0) {
		return statement;
	}

	let addWhere = false;
	for (let i = 0; i < conditions.length; i++) {
		const { where, equals } = conditions[i];

		// skip invalid conditions
		if (!where || !equals) {
			continue;
		}

		// only add "WHERE" once
		if (!addWhere) {
			statement += ` WHERE `;
			addWhere = true;
		}

		// support multiple conditions, only append "OR" if the next one is valid
		statement += `${where} = '${equals}'`;
		if (i < conditions.length - 1 && conditions[i + 1].equals) {
			statement += ` OR `;
		}
	}

	return statement;
}
