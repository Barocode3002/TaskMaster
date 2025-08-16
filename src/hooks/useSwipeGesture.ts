import { useRef, useEffect, useState } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  preventDefaultTouchmove?: boolean;
}

interface SwipeState {
  isSwipedLeft: boolean;
  isSwipedRight: boolean;
  swipeDistance: number;
}

export const useSwipeGesture = (options: SwipeGestureOptions) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    threshold = 50,
    preventDefaultTouchmove = true,
  } = options;

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwipedLeft: false,
    isSwipedRight: false,
    swipeDistance: 0,
  });

  const resetSwipe = () => {
    setSwipeState({
      isSwipedLeft: false,
      isSwipedRight: false,
      swipeDistance: 0,
    });
    isSwiping.current = false;
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      touchCurrentX.current = touch.clientX;
      isSwiping.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (preventDefaultTouchmove) {
        e.preventDefault();
      }

      const touch = e.touches[0];
      touchCurrentX.current = touch.clientX;
      
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = Math.abs(touch.clientY - touchStartY.current);
      
      // Only consider horizontal swipes (ignore vertical scrolling)
      if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > deltaY) {
        isSwiping.current = true;
        
        setSwipeState({
          isSwipedLeft: deltaX < -threshold,
          isSwipedRight: deltaX > threshold,
          swipeDistance: deltaX,
        });
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwiping.current) {
        resetSwipe();
        return;
      }

      const deltaX = touchCurrentX.current - touchStartX.current;
      const deltaY = Math.abs((e.changedTouches[0]?.clientY || touchStartY.current) - touchStartY.current);
      
      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > deltaY) {
        if (deltaX < -threshold && onSwipeLeft) {
          onSwipeLeft();
        } else if (deltaX > threshold && onSwipeRight) {
          onSwipeRight();
        }
      }
      
      // Reset after a short delay to allow for visual feedback
      setTimeout(resetSwipe, 300);
    };

    // Mouse events for desktop testing
    let isMouseDown = false;
    let mouseStartX = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      mouseStartX = e.clientX;
      touchStartX.current = e.clientX;
      touchCurrentX.current = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      
      touchCurrentX.current = e.clientX;
      const deltaX = e.clientX - mouseStartX;
      
      setSwipeState({
        isSwipedLeft: deltaX < -threshold,
        isSwipedRight: deltaX > threshold,
        swipeDistance: deltaX,
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      
      const deltaX = e.clientX - mouseStartX;
      
      if (deltaX < -threshold && onSwipeLeft) {
        onSwipeLeft();
      } else if (deltaX > threshold && onSwipeRight) {
        onSwipeRight();
      }
      
      setTimeout(resetSwipe, 300);
    };

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Add mouse event listeners for desktop testing
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseUp);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [onSwipeLeft, onSwipeRight, threshold, preventDefaultTouchmove]);

  return {
    elementRef,
    swipeState,
    resetSwipe,
  };
};
