import { render } from '@testing-library/react';

import CustomDraftEditor from './custom-draft-editor';

describe('CustomDraftEditor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomDraftEditor />);
    expect(baseElement).toBeTruthy();
  });
});
