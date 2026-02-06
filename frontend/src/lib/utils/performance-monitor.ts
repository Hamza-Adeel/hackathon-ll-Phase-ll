import { useEffect, useRef } from 'react';

// Interface for animation performance metrics
interface AnimationMetrics {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  fps?: number;
  droppedFrames?: number;
  memoryUsed?: number;
}

// Animation performance monitor class
class AnimationPerformanceMonitor {
  private metricsMap: Map<string, AnimationMetrics> = new Map();
  private observer?: PerformanceObserver;
  private frameStartTimes: Map<string, number> = new Map();
  private frameCount: Map<string, number> = new Map();
  private lastFrameTime: Map<string, number> = new Map();

  constructor() {
    this.initPerformanceObserver();
  }

  // Initialize performance observer to track animation frames
  private initPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure') {
            // Handle custom measurements
            console.debug(`Performance measure: ${entry.name}`, entry.duration);
          }
        });
      });

      this.observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    }
  }

  // Start monitoring an animation
  public startAnimation(id: string): void {
    const startTime = performance.now();

    this.metricsMap.set(id, {
      id,
      startTime,
      duration: 0,
      fps: 0,
      droppedFrames: 0
    });

    this.frameStartTimes.set(id, startTime);
    this.frameCount.set(id, 0);
    this.lastFrameTime.set(id, startTime);
  }

  // Mark a frame during animation
  public markFrame(id: string): void {
    const currentTime = performance.now();
    const lastFrameTime = this.lastFrameTime.get(id) || currentTime;
    const elapsed = currentTime - lastFrameTime;

    // Calculate FPS (frames per second)
    const fps = elapsed > 0 ? Math.round(1000 / elapsed) : 0;

    // Update metrics
    const metrics = this.metricsMap.get(id);
    if (metrics) {
      const frameCount = (this.frameCount.get(id) || 0) + 1;
      this.frameCount.set(id, frameCount);

      // Estimate dropped frames (anything below 60fps indicates potential drops)
      let droppedFrames = metrics.droppedFrames || 0;
      if (fps < 50) { // Threshold for acceptable frame rate
        droppedFrames += Math.max(0, Math.floor((60 - fps) / 10)); // Rough estimation
      }

      this.metricsMap.set(id, {
        ...metrics,
        fps,
        droppedFrames
      });
    }

    this.lastFrameTime.set(id, currentTime);
  }

  // Stop monitoring an animation
  public stopAnimation(id: string): AnimationMetrics | null {
    const metrics = this.metricsMap.get(id);
    if (!metrics) return null;

    const endTime = performance.now();
    const duration = endTime - metrics.startTime;

    const finalMetrics: AnimationMetrics = {
      ...metrics,
      endTime,
      duration
    };

    this.metricsMap.set(id, finalMetrics);

    // Log performance warnings if needed
    this.logPerformanceWarnings(finalMetrics);

    return finalMetrics;
  }

  // Log performance warnings based on metrics
  private logPerformanceWarnings(metrics: AnimationMetrics): void {
    if (metrics.fps && metrics.fps < 30) {
      console.warn(`Low FPS detected for animation "${metrics.id}": ${metrics.fps} FPS`);
    }

    if (metrics.droppedFrames && metrics.droppedFrames > 10) {
      console.warn(`High dropped frame count for animation "${metrics.id}": ${metrics.droppedFrames} frames`);
    }

    if (metrics.duration && metrics.duration > 1000) { // More than 1 second
      console.warn(`Long animation duration for "${metrics.id}": ${Math.round(metrics.duration)}ms`);
    }
  }

  // Get metrics for an animation
  public getMetrics(id: string): AnimationMetrics | undefined {
    return this.metricsMap.get(id);
  }

  // Get all metrics
  public getAllMetrics(): AnimationMetrics[] {
    return Array.from(this.metricsMap.values());
  }

  // Clear metrics for an animation
  public clearMetrics(id: string): void {
    this.metricsMap.delete(id);
    this.frameStartTimes.delete(id);
    this.frameCount.delete(id);
    this.lastFrameTime.delete(id);
  }

  // Clear all metrics
  public clearAllMetrics(): void {
    this.metricsMap.clear();
    this.frameStartTimes.clear();
    this.frameCount.clear();
    this.lastFrameTime.clear();
  }

  // Get average FPS across all monitored animations
  public getAverageFPS(): number {
    const allMetrics = Array.from(this.metricsMap.values()).filter(m => m.fps !== undefined);
    if (allMetrics.length === 0) return 0;

    const totalFPS = allMetrics.reduce((sum, metrics) => sum + (metrics.fps || 0), 0);
    return totalFPS / allMetrics.length;
  }

  // Destroy the monitor and clean up resources
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.clearAllMetrics();
  }
}

// Singleton instance of the performance monitor
const animationPerformanceMonitor = new AnimationPerformanceMonitor();

// React hook for performance monitoring
export const useAnimationPerformance = (id: string, enabled: boolean = true) => {
  const isMonitoringRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Start monitoring when component mounts
    animationPerformanceMonitor.startAnimation(id);
    isMonitoringRef.current = true;

    // Clean up when component unmounts
    return () => {
      if (isMonitoringRef.current) {
        animationPerformanceMonitor.stopAnimation(id);
        isMonitoringRef.current = false;
      }
    };
  }, [id, enabled]);

  // Function to mark a frame during animation
  const markFrame = () => {
    if (enabled) {
      animationPerformanceMonitor.markFrame(id);
    }
  };

  // Function to get current metrics
  const getMetrics = () => {
    return animationPerformanceMonitor.getMetrics(id);
  };

  return {
    markFrame,
    getMetrics,
    monitor: animationPerformanceMonitor
  };
};

// Performance monitoring decorator for animation functions
export function withPerformanceMonitoring<T extends (...args: any[]) => any>(fn: T, id: string) {
  return (...args: Parameters<T>): ReturnType<T> => {
    animationPerformanceMonitor.startAnimation(id);

    const result = fn(...args);

    // In a real implementation, we would stop monitoring when the animation completes
    // This is simplified for demonstration purposes

    return result;
  };
}

// Export the singleton instance for direct access
export { animationPerformanceMonitor };

// Performance monitoring constants
export const PERFORMANCE_THRESHOLDS = {
  MIN_FPS: 30,
  MAX_ANIMATION_DURATION: 1000, // ms
  MAX_DROPPED_FRAMES: 10
} as const;