import "@testing-library/jest-dom";

global.fetch = vi.fn();

// Mock ResizeObserver for Radix UI components
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// Mock pointer capture methods for Radix UI components
Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
Element.prototype.setPointerCapture = vi.fn();
Element.prototype.releasePointerCapture = vi.fn();

// Mock scrollIntoView for Radix UI
Element.prototype.scrollIntoView = vi.fn();
