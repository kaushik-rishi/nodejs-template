import { kebabCase } from "./general";

export function toHermesTopic(str) {
	return str.replace(/\{([^}]+)\}/g, ':$1');
}

export function queueName(title, version) {
	return kebabCase(`${title}-${version}`.toLowerCase()).split('-').join('.');
}

export function toMqttTopic(topics, shouldAppendWildcard = false) {
	const toMqtt = (str, appendWildcard = false) => {
		let result = str;
		if (result === '/') return '#';
		if (result.startsWith('/')) result = result.substr(1);
		result = result.replace(/\{([^}]+)\}/g, '+');
		if (appendWildcard) result += '/#';
		return result;
	};

	if (typeof topics === 'string') return toMqtt(topics, shouldAppendWildcard);
	if (Array.isArray(topics)) return topics.map(toMqtt);
}

export function toKafkaTopic(topics) {
	const toKafka = (str) => {
		let result = str;
		if (result.startsWith('/')) result = result.substr(1);
		result = result.replace(/\//g, '__');
		return result;
	};

	if (typeof topics === 'string') return toKafka(topics);
	if (Array.isArray(topics)) return topics.map(toKafka);
}

export function toAmqpTopic(topics, shouldAppendWildcard = false) {
	const toAmqp = (str, appendWildcard = false) => {
		let result = str;
		if (result === '/') return '#';
		if (result.startsWith('/')) result = result.substr(1);
		result = result.replace(/\//g, '.').replace(/\{([^}]+)\}/g, '*');
		if (appendWildcard) result += '.#';
		return result;
	};

	if (typeof topics === 'string') return toAmqp(topics, shouldAppendWildcard);
	if (Array.isArray(topics)) return topics.map(toAmqp);
}
