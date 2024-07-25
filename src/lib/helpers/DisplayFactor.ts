export class Prefix {
	private callback;
	constructor(callback: () => string) {
		this.callback = callback;
	}
	getPrefix(): string {
		return this.callback();
	}

  
  
	static of(prefix: string) {
		return new Prefix(() => prefix);
	}

	static determine(colType: string) {
    let prefix: string  
		switch (colType) {
			case 'additive':
				prefix = '+';
				break;
			case 'subtractive':
				prefix = '-';
				break;
			case 'multiplicative':
				prefix = '×';
				break;
			case 'divisive':
				prefix = '/';
				break;
      default: 
        prefix = ""
        break
		}
    return Prefix.of(prefix)
	}
}

// Given a column type and factor number, return a string to summarize this information, e.g x10, +6, -8, /2
export class FactorStringGenerator {
	private colType;
	private factor;
	private prefix;

	constructor(colType: string, factor: number) {
		this.colType = colType;
		this.factor = factor;
		this.prefix = Prefix.determine(colType);
	}

	getFactorString() {
		return this.prefix.getPrefix().concat(this.getFactorAdaptedForColType().trim());
	}

	private getFactorAdaptedForColType(): string {
		if (['multiplicative', 'divisive'].includes(this.colType)) {
			return (this.factor + 1).toString();
		}

		return this.factor.toString();
	}
}
