(() => {
  const VCProto = Entry?.VariableContainer?.prototype;
  if (!VCProto) {
    console.warn('Entry.VariableContainer를 찾을 수 없습니다.');
    return;
  }
  if (VCProto.generateListValuesView.__patched) {
    console.log('이미 적용됨');
  } else {
    const original = VCProto.generateListValuesView;
    VCProto.generateListValuesView = function(...args) {
      original.apply(this, args);

      const sb = this.listSettingView.simpleBar;
      const content = sb.getContentElement();
      const wrapper = sb.getScrollElement ? sb.getScrollElement() : content.parentElement;

      const vs = this.listSettingView.infinityScroll;

      try { content.removeEventListener('scroll', vs.scroll); } catch (e) {}
      try { wrapper.removeEventListener('scroll', vs.scroll); } catch (e) {}

      vs.dom = content;

      if (!vs.__patchedScrollMetrics) {
        Object.defineProperty(vs, 'height', {
          get() { return wrapper.offsetHeight || 1; },
          configurable: true,
        });
        Object.defineProperty(vs, 'currGroup', {
          get() {
            const gh = this.groupHeight || 1;
            return Math.floor((wrapper.scrollTop || 0) / gh);
          },
          configurable: true,
        });
        vs.__patchedScrollMetrics = true;
      }

      wrapper.addEventListener('scroll', vs.scroll);
      vs._currGroup = -1;
      vs.show();
    };
    VCProto.generateListValuesView.__patched = true;
    console.log('적용 완료');
  }

  const vc = Entry?.variableContainer;
  const view = vc?.listSettingView;
  if (view) {
    const sb = view.simpleBar;
    const content = sb.getContentElement();
    const wrapper = sb.getScrollElement ? sb.getScrollElement() : content.parentElement;
    const vs = view.infinityScroll;

    try { content.removeEventListener('scroll', vs.scroll); } catch (e) {}
    try { wrapper.removeEventListener('scroll', vs.scroll); } catch (e) {}

    vs.dom = content;
    if (!vs.__patchedScrollMetrics) {
      Object.defineProperty(vs, 'height', {
        get() { return wrapper.offsetHeight || 1; },
        configurable: true,
      });
      Object.defineProperty(vs, 'currGroup', {
        get() {
          const gh = vs.groupHeight || 1;
          return Math.floor((wrapper.scrollTop || 0) / gh);
        },
        configurable: true,
      });
      vs.__patchedScrollMetrics = true;
    }
    wrapper.addEventListener('scroll', vs.scroll);
    vs._currGroup = -1;
    vs.show();
  }
})();
