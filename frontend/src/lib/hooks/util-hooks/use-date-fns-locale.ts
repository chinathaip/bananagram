import { useCurrentLocale } from "@/locales";
import { useEffect, useState } from "react";

import { Locale, enUS, th } from "date-fns/locale";

export function useDateFnsLocale() {
	const locale = useCurrentLocale();
	const [dateFnsLocale, setDateFnsLocale] = useState<Locale>(enUS);

	useEffect(() => {
		switch (locale) {
			case "en":
				setDateFnsLocale(enUS);
				break;
			case "th":
				setDateFnsLocale(th);
				break;
			default:
				setDateFnsLocale(enUS);
				break;
		}
	}, [locale]);

	return dateFnsLocale;
}
