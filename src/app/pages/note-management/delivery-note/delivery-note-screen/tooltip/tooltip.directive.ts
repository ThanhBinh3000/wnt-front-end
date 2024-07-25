import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input() appTooltip: any;

  private tooltipElement: any;
  private hideTimeout: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.showTooltip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.scheduleHideTooltip();
  }

  @HostListener('document:click', ['$event']) onClickOutside(event: MouseEvent) {
    const clickedInside = this.el.nativeElement.contains(event.target) || (this.tooltipElement && this.tooltipElement.contains(event.target));
    if (!clickedInside) {
      this.hideTooltip();
    }
  }

  private showTooltip() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (this.tooltipElement) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
    }

    this.tooltipElement = this.renderer.createElement('div');
    this.tooltipElement.classList.add('tooltip-content');
    console.log(this.appTooltip)
    // Tạo nội dung tooltip từ `appTooltip`
    let h = 30;
    let tooltipContent = `
      <p>Vị trí tủ kho: ${this.appTooltip.tuKho}</p>
      <p>Ưu điểm: ${this.appTooltip.uuDiem}</p>
      <p>Đối tượng sử dụng: ${this.appTooltip.doiTuongSuDung}</p>
      <p>---------------------------</p>
    `;
    if(this.appTooltip.bundleGoods && this.appTooltip.bundleGoods.length > 0) {
      h+=40;
      tooltipContent += `
         <div>
            <p><span>Hàng bán kèm:</span> ${this.appTooltip.bundleGoods[0].maThuoc} - ${this.appTooltip.bundleGoods[0].tenThuoc}</p>
            <p><span style="background-color: #0d6efd">Giá bán: ${this.appTooltip.bundleGoods[0].giaBanLe} </span><button>Bán</button></p>
        </div>
    `;
    }
    if(this.appTooltip.replaceGoods && this.appTooltip.replaceGoods.length > 0) {
      h+=40;
      tooltipContent += `
         <div>
            <p><span>Hàng thay thế:</span> ${this.appTooltip.replaceGoods[0].maThuoc} - ${this.appTooltip.replaceGoods[0].tenThuoc}</p>
            <p><span style="background-color: #0d6efd">Giá bán: ${this.appTooltip.replaceGoods[0].giaBanLe} </span><button>Bán</button></p>
        </div>
    `;
    }

    this.tooltipElement.innerHTML = tooltipContent;

    this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);

    // Định vị tooltip
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipElement.getBoundingClientRect();

    const top = hostPos.top - tooltipPos.height + h + window.scrollY;
    const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2 + window.scrollX;

    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    this.renderer.setStyle(this.tooltipElement, 'background-color', 'white');
    this.renderer.setStyle(this.tooltipElement, 'border', '1px solid #ccc');
    this.renderer.setStyle(this.tooltipElement, 'padding', '10px');
    this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0 4px 8px rgba(0, 0, 0, 0.1)');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '5px');
    setTimeout(() => this.renderer.setStyle(this.tooltipElement, 'opacity', '1'), 0);


    // Thêm sự kiện mouseenter và mouseleave cho tooltipElement
    this.renderer.listen(this.tooltipElement, 'mouseenter', () => {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
    });

    this.renderer.listen(this.tooltipElement, 'mouseleave', () => {
      this.scheduleHideTooltip();
    });

    // Lắng nghe sự kiện click vào nút đóng
    const closeBtn = this.tooltipElement.querySelector('.close-btn');
    if (closeBtn) {
      this.renderer.listen(closeBtn, 'click', () => {
        this.hideTooltip();
      });
    }
  }

  private scheduleHideTooltip() {
    this.hideTimeout = setTimeout(() => {
      this.hideTooltip();
    }, 200);
  }

  private hideTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
