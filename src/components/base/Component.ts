export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {

  }

  setDisable(element: HTMLElement, state: boolean): void {
    if (state) {
      element.setAttribute('disabled', 'disabled');
    } else {
      element.removeAttribute('disabled')
    }
  }

  protected setText(element: HTMLElement, value: unknown) {
            if (element) {
            element.textContent = String(value);
        }
  }

  setImage(element: HTMLImageElement, src: string, alt?: string) {
    if (element) {
      element.src = src;
        if (alt) {
          element.alt = alt;
        }
    }
  }

  render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}