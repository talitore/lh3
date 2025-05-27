/**
 * Tests for Input component
 */

import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-data';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input Component', () => {
  it('should render with default props', () => {
    render(<Input data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('data-slot', 'input');
    expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border');
  });

  it('should accept and display a value', () => {
    render(<Input value="test value" readOnly data-testid="input" />);
    
    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('should handle onChange events', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    
    render(<Input onChange={handleChange} data-testid="input" />);
    
    const input = screen.getByTestId('input');
    await user.type(input, 'hello');
    
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('hello');
  });

  it('should handle different input types', () => {
    const { rerender } = render(<Input type="text" data-testid="input" />);
    let input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'text');

    rerender(<Input type="email" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type="password" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'password');

    rerender(<Input type="number" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('should accept custom className', () => {
    render(<Input className="custom-class" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('custom-class');
  });

  it('should forward refs correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should handle placeholder text', () => {
    render(<Input placeholder="Enter your name" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('placeholder', 'Enter your name');
  });

  it('should handle required attribute', () => {
    render(<Input required data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('required');
  });

  it('should handle readonly attribute', () => {
    render(<Input readOnly data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('readonly');
  });

  it('should handle focus and blur events', async () => {
    const user = userEvent.setup();
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    
    render(
      <Input 
        onFocus={handleFocus} 
        onBlur={handleBlur} 
        data-testid="input" 
      />
    );
    
    const input = screen.getByTestId('input');
    
    await user.click(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard events', async () => {
    const user = userEvent.setup();
    const handleKeyDown = jest.fn();
    const handleKeyUp = jest.fn();
    
    render(
      <Input 
        onKeyDown={handleKeyDown} 
        onKeyUp={handleKeyUp} 
        data-testid="input" 
      />
    );
    
    const input = screen.getByTestId('input');
    
    await user.type(input, 'a');
    
    expect(handleKeyDown).toHaveBeenCalled();
    expect(handleKeyUp).toHaveBeenCalled();
  });

  it('should handle min and max attributes for number inputs', () => {
    render(
      <Input 
        type="number" 
        min={0} 
        max={100} 
        data-testid="input" 
      />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('should handle step attribute for number inputs', () => {
    render(
      <Input 
        type="number" 
        step={0.1} 
        data-testid="input" 
      />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('step', '0.1');
  });

  it('should handle maxLength attribute', () => {
    render(<Input maxLength={10} data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('maxlength', '10');
  });

  it('should handle autoComplete attribute', () => {
    render(<Input autoComplete="email" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('should handle aria attributes', () => {
    render(
      <Input 
        aria-label="Email address"
        aria-describedby="email-help"
        aria-invalid={true}
        data-testid="input" 
      />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-label', 'Email address');
    expect(input).toHaveAttribute('aria-describedby', 'email-help');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should handle controlled input correctly', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [value, setValue] = React.useState('');
      return (
        <Input 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="controlled-input"
        />
      );
    };

    render(<TestComponent />);
    
    const input = screen.getByTestId('controlled-input');
    
    await user.type(input, 'controlled');
    expect(input).toHaveValue('controlled');
  });

  it('should handle uncontrolled input correctly', async () => {
    const user = userEvent.setup();
    
    render(<Input defaultValue="default" data-testid="uncontrolled-input" />);
    
    const input = screen.getByTestId('uncontrolled-input');
    expect(input).toHaveValue('default');
    
    await user.clear(input);
    await user.type(input, 'uncontrolled');
    expect(input).toHaveValue('uncontrolled');
  });
});
