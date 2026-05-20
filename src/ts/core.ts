export type OnChangeCallbackFn<T> = (next: T) => void;


export type ReactiveObject<T extends object> =
	T & {
		// Dynamically generate watchers methods for each property
		[property in keyof T as `watch${Capitalize<string & property>}`]
			:(handler: OnChangeCallbackFn<T[property]>) => () => void;
	};

export function reactive<T extends object>(state: T): ReactiveObject<T> {
	const handlers = {} as {
		[property in keyof T]: Array<OnChangeCallbackFn<T[property]>>
	};

	const getHandlerKey = (property: string): keyof T | undefined => {
		const match = /^watch(.+)$/.exec(property);
		return match
			? (match[1].charAt(0).toLowerCase() + match[1].slice(1)) as keyof T
			: undefined;
	};

	const isNotValidProperty = (property: string | symbol): boolean => typeof property !== 'string';

	const selectBoundedElements = (property: string | symbol): NodeListOf<Element> => document.querySelectorAll(`[data-binding="${String(property)}"]`);

	const applyContent = <T extends Record<string | symbol, any>>( state: T, property: string | symbol) => {
		if ((property as keyof T) in state)
			selectBoundedElements(property as Extract<keyof T, string | symbol>)
				?.forEach(element => {
					let newElement = element.cloneNode(false);
					const textContent = state[property]?.toString() ?? '';
					newElement.textContent = textContent;
					element.replaceWith(newElement);
				});
	}

	const parseValue = (raw: string): any => {
		if (raw === 'true') return true;
		if (raw === 'false') return false;
		if (raw === 'null') return null;
		if (/^['"]/.test(raw)) return raw.slice(1, -1);
		const num = Number(raw);
		return isNaN(num) ? raw : num;
	};

	const compare = (a: any, op: string, b: any): boolean => {
		switch (op) {
			case '>':   return a > b;
			case '<':   return a < b;
			case '>=':  return a >= b;
			case '<=':  return a <= b;
			case '==':  return a == b;
			case '===': return a === b;
			case '!=': return a != b;
			case '!==': return a !== b;
			default:    return false;
		}
	};


	const regexClassBinding = /(.+?)\s*(==|!=|>=|<=|>|<)\s*(['"]?[^'"]*?['"]?)\s*\?\s*['"]([^'"]*?)['"]\s*:\s*['"]([^'"]*?)['"]/;	
	const applyClassBinding = <T extends Record<string | symbol, any>>(state: T, prop: keyof T) => {
		const value = state[prop];

		document.querySelectorAll(`[data-class-binding*="${String(prop)} "]`).forEach(element => {
			const binding = element.getAttribute('data-class-binding');
			if (!binding) return;

			const rules = binding.split(';').map(r => r.trim()).filter(r => r);
			const classList = element.classList;
			
			rules.forEach(rule => {
				const match = regexClassBinding.exec(rule);
				if (!match) return;

				const [, condProp, operator, rawValue, trueClass, falseClass] = match;
				if (condProp.trim() as keyof T !== prop) return;

				const result = compare(value, operator, parseValue(rawValue.trim()));

				if (classList.value) {
					if (trueClass) classList.remove(trueClass);
					if (falseClass) classList.remove(falseClass);
				}
				if (result && trueClass) classList.add(trueClass);
				if (!result && falseClass) classList.add(falseClass);
			});
		});
	};


	const render = <T extends Record<string | symbol, any>>(
		state: T,
		property: string | symbol
	): void => {
		applyContent(state, property);
		applyClassBinding(state, property);
	};

	const proxy = new Proxy(state, {
		get(target, property) {
			if (isNotValidProperty(property))
				return Reflect.get(target, property);;

			const handlerKey = getHandlerKey(property as string);
			if (!handlerKey)
				return Reflect.get(target, property);

			return (handler: OnChangeCallbackFn<any>) => {
				(handlers[handlerKey] ??= []).push(handler);
				return () => {
					handlers[handlerKey] = handlers[handlerKey]?.filter(h => h !== handler);
				};
			};
		},
		set(target, property, value) {
			if (isNotValidProperty(property))
				return Reflect.set(target, property, value);

			const prop = property as keyof T;
			const prev = target[prop];
			const setResult = Reflect.set(target, prop, value);

			if (value === prev || !setResult)
				return setResult;

			render(state, property);
			handlers[prop]?.forEach(handler => handler(value));
			return setResult;
		}
	}) as ReactiveObject<T>;

	(Object.keys(state) as Array<Extract<keyof T, string>>).forEach(property => render(state, property));

	return proxy;
}