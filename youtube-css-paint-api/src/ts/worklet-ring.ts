interface PaintSize {
	width: number;
	height: number;
}

export class WorkletRing {

	private ctx: CanvasRenderingContext2D;
	private props: StylePropertyMapReadOnly;

	private color1: string;
	private color2: string;
	private percent1: number;
	private percent2: number;
	private startAngle1: number;
	private endAngle1: number;
	private startAngle2: number;
	private endAngle2: number;
	private width: number;
	private height: number;
	private x: number;
	private y: number;
	private lineWidth: number;
	private radius: number;

	// static get contextOptions() {
	// 	return { alpha: true };
	// }

	/*
	 use this function to retrieve any custom properties (or regular properties, such as 'height')
	 defined for the element, return them in the specified array
*/

	static get inputProperties() {
		return [
			'--colorRing1',
			'--colorRing2',
			'--percentRing1',
			'--percentRing2',
		];
	}

	public paint(ctx: CanvasRenderingContext2D, size: PaintSize, props: StylePropertyMapReadOnly): void {
		this.ctx = ctx;
		this.width = size.width;
		this.height = size.height;
		this.props = props;

		this.initCssVars();
		this.calcSize();
		this.calcAngles();
		this.drawRing();
	}

	private drawRing(): void {
		// Рисуем первую часть кольца
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, this.startAngle1, this.endAngle1);
		this.ctx.strokeStyle = this.color1;
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.stroke();

		// Рисуем вторую часть кольца
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, this.startAngle2, this.endAngle2);
		this.ctx.strokeStyle = this.color2;
		this.ctx.stroke();
	}

	private initCssVars(): void {
		this.color1 = this.getString('--colorRing1');
		this.color2 = this.getString('--colorRing2');
		this.percent1 = this.getNumber('--percentRing1');
		this.percent2 = this.getNumber('--percentRing2');
	}

	private calcSize(): void {
		this.x = this.width / 2;
		this.y = this.height / 2;

		this.lineWidth = Math.min(this.width, this.height) * 0.15;
    this.radius = Math.min(this.width, this.height) * 0.3;
	}

	private calcAngles(): void {
		this.startAngle1 = -0.5 * Math.PI; // начальный угол для первой части (12 часов)
		this.endAngle1 = this.startAngle1 + (2 * Math.PI * this.percent1 / 100); // конечный угол для первой части
		this.startAngle2 = this.endAngle1; // начальный угол для второй части (заканчивается там, где закончилась первая)
		this.endAngle2 = this.startAngle2 + (2 * Math.PI * this.percent2 / 100); // конечный угол для второй части
	}

	private get(key: string): CSSStyleValue | "" {
		const val = this.props.get(key);

		if (!val) {
			return '';
		}
		return val;
	}

	private getString(key: string): string {
		return String(this.get(key));
	}

	private getNumber(key: string): number {
		return Number(this.get(key)[0] || this.get(key).value) || 0;
	}

}



type ClassName<T = any, Arguments extends unknown[] = any[]> = {
	prototype: T;
	new(...arguments_: Arguments): T;
};

declare function registerPaint(param1: string, param2: ClassName): void;

registerPaint("ring", WorkletRing);
