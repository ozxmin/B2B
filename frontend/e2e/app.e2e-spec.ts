import { Connectedb2bPage } from './app.po';

describe('connectedb2b App', function() {
  let page: Connectedb2bPage;

  beforeEach(() => {
    page = new Connectedb2bPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
