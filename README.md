# moovish

React Native app for gathering information about movies, TV shows and documentaries. Powered by TMDB's API

# Build it yourself

1. Make sure you have the React Native CLI properly installed and setup on your computer before we move forward. If you haven't set that up yet, you can get everything ready by reading [this](https://reactnative.dev/docs/environment-setup)
2. Clone this repo:
   `git clone https://github.com/ismaelduraes/moovish`
3. cd into it's directory:
   `cd moovish`
4. Install node dependencies:
   `npm install`
5. (If developing for android, skip to step 6)
   <br/>If you're on macOS and developing for iOS, install pod dependencies: `cd ios && pod install && cd ..`
6. Add your TMDB API keys to `.env.template`, copy it and rename it to `.env`.
7. Optional: Run moovish by running `npm start` on your preferred terminal, then, on another terminal tab, running `npx react-native run-android` or `npx react-native run-ios`.
8. If building for Android, run `cd android && ./gradlew assembleRelease && cd ..`
   <br/>For iOS, [read this](https://reactnative.dev/docs/publishing-to-app-store)
   <br/>
   > Important: On your first Android build, you might get an error saying you haven't set up an Android SDK path. For a solution, read [this](https://stackoverflow.com/a/48155800)

# Important

- If you're wondering where you can find the source code for moovish's back-end, the answer is that you can't, for now. It will be released as soon as I can, but i'm currently refactoring and optimizing it and haven't had much time to finish and/or publish it just yet. For now, moovish connects to the remote server running on moovish.durev.net by default.
  <br/>
  <br/>
- Please note that this app was only made for practice and study purposes only. You can do with this code whatever you will; but I don't plan on keeping it updated long term, nor do I guarantee that I will support it in the future.
  <br/>
  <br/>
- Feel free to make it your own, re-release it or do whatever; I truly do not mind. Whatever changes you make to it, though, don't publish them as if they were made by me. I am not responsible for anything that is made beyond the code in this repository.
