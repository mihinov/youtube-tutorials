import gsap from 'gsap';

export class Ring {
	private color1: string;
	private color2: string;
	private percent1: number;
	private percent2: number;
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private drawing: boolean = false;
	private startAngle1: number;
	private endAngle1: number;
	private startAngle2: number;
	private endAngle2: number;
	private defaultDuration: number = 2;
	private width: number;
	private height: number;
	private x: number;
	private y: number;
	private lineWidth: number;
	private radius: number;

	constructor(
		{ canvas, color1, percent1, color2, percent2 }
	) {
		this.color1 = color1;
		this.color2 = color2;
		this.percent1 = percent1;
		this.percent2 = percent2;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d")!;
		this.calcSize();
		this.startAngle1 = -0.5 * Math.PI; // начальный угол для первой части (12 часов)
		this.endAngle1 = this.startAngle1 + (2 * Math.PI * this.percent1 / 100); // конечный угол для первой части
		this.startAngle2 = this.endAngle1; // начальный угол для второй части (заканчивается там, где закончилась первая)
		this.endAngle2 = this.startAngle2 + (2 * Math.PI * this.percent2 / 100); // конечный угол для второй части

		this.drawRing();
		this.addListeners();
	}

	public drawRing() {
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

	public updatePercent({
		percent1 = this.percent1,
		percent2 = this.percent2,
		color1 = this.color1,
		color2 = this.color2
	} = {}) {
		this.percent1 = percent1;
		this.percent2 = percent2;
		this.endAngle1 = this.startAngle1 + (2 * Math.PI * this.percent1 / 100);
		this.startAngle2 = this.endAngle1;
		this.endAngle2 = this.startAngle2 + (2 * Math.PI * this.percent2 / 100);
		this.color1 = color1;
		this.color2 = color2;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.drawRing();
	}

	public animUpdatePercent({
		percent1 = this.percent1,
		percent2 = this.percent2,
		duration = this.defaultDuration,
		color1 = this.color1,
		color2 = this.color2,
		delay = 0
	} = {}) {

		const tl = gsap.timeline()
			.to(this, {
				duration: duration,
				percent1: percent1,
				percent2: percent2,
				color1: color1,
				color2: color2,
				delay: delay,
				onUpdate: () => {
					this.updatePercent({percent1: this.percent1, percent2: this.percent2});
				},
			});

		return tl;
	}

	private addListeners() {
		window.addEventListener('resize', () => {
			this.calcSize();

			if (this.drawing === false) {
				this.drawRing();
			}
		});
	}

	private calcSize() {
		const { width, height } = this.canvas.getBoundingClientRect();

		this.width = width;
		this.height = height;

		this.x = this.width / 2;
		this.y = this.height / 2;

		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.lineWidth = Math.min(this.width, this.height) * 0.15;
    this.radius = Math.min(this.width, this.height) * 0.3;
	}

}
