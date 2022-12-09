# Test 1: User Interface
- Test Case: let the user do some tasks with the app without any help to see if the UI is intuitive.
- User Feedback:
  - "The menu icons and description are helpful. I like how it's easy to take notes and delete them. The font could be improved though."
- Action Taken:
  - Changed the font family, and increased its size and weight.

# Test 1: Correct Location
- Test Case: Check if a user's location is displayed properly on the map and is being updated.
- User Feedback:
  - "I can see my location on the map displayed correctly. It also updates."
- Action Taken:
  - None

# Test 1: Installation and Offline Usage
- Test Case: Check if a user can easily install the app and use it offline.
- User Feedback:
  - "I like that you can install the app, but it's showing things."
- Action Taken:
  - The data being requested by the app isn't fetched preperly. So, I modified the service worker accordingly to retrieve data when online.