/**
 * Analytics utility for tracking user interactions
 */

// Track waitlist signup
export function trackWaitlistSignup(userData: { fullName: string; email: string; id: number }) {
  try {
    console.log('Analytics: Waitlist Signup', {
      userId: userData.id,
      timestamp: new Date().toISOString(),
      event: 'waitlist_signup'
    });
    
    // This could be expanded to send data to an external analytics service
    // like Google Analytics, Mixpanel, etc.
  } catch (error) {
    console.error('Failed to track signup event:', error);
  }
}

// Track page view
export function trackPageView(page: string) {
  try {
    console.log('Analytics: Page View', {
      page,
      timestamp: new Date().toISOString(),
      event: 'page_view'
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
}

// Track feature section interaction
export function trackFeatureInteraction(featureName: string) {
  try {
    console.log('Analytics: Feature Interaction', {
      feature: featureName,
      timestamp: new Date().toISOString(),
      event: 'feature_interaction'
    });
  } catch (error) {
    console.error('Failed to track feature interaction:', error);
  }
}
