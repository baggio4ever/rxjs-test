import { RxjsTestPage } from './app.po';

describe('rxjs-test App', () => {
  let page: RxjsTestPage;

  beforeEach(() => {
    page = new RxjsTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
