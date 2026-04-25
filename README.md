<div align="center" >
<h1 align="center">GarboGotchi</h1>
<p align="center">
  Have you ever wanted to make cleaning fun? Now you can... with <strong>GarboGotchi</strong>!</br>
  Link good trash habits to a fun pet that makes you sort trash correctly while rewarding you every time you clean.
</p>

<img width="806" height="564" alt="image" src="https://github.com/user-attachments/assets/d59d3715-fc87-4013-99d4-99e78fd40f67" />
<br/>
<p align="center">
  <blockquote>
    This project won 2nd Place Overall at CitrusHack 2025. For more information, check the <a target="_blank" rel="noopener noreferrer" href="https://devpost.com/software/garbogotchi">DevPost</a>.
  </blockquote>
</p>
</div>


## Inspiration

There's an ever-growing need for environmental awareness and the importance of sorting trash correctly. Whether it's throwing a water bottle or an orange peel in the trash, we wanted to provide a practical yet fun solution that encourages children to sort their trash correctly. Gamifying this process makes it engaging while promoting eco-friendly habits.  

## What it does

GarboGotchis are virtual pets that grow based on how well their owner sorts their trash, making recycling and composting fun and rewarding. Our project is a sustainable, self-sorting trash can linked to a desktop application. When users show their waste to their webcam, the trash can opens the corresponding compartment, and you are rewarded with points for your Tamagotchi. We also included a feature to track past Tamagotchis, giving users an incentive to keep improving. We also added a skins feature to allow for different customizations.

## How we built it
We built GarboGotchi using the following technologies:
- Frontend: Electron + React.js + TailwindCSS for a responsive user interface
- Machine Learning: Teachable Machine and Tensorflow.js for training and integrating our image classification model to detect trash types
- Hardware: Arduino board to select the correct trash bin based on ML predictions
- Backend: Node.js to handle server-side logic and communication with Arduino via serial port
- Assets: We used a combination of self-made assets via Aseprite and free assets from Pixabay and Free SVG Backgrounds

## Challenges we ran into
- Machine Learning Model Accuracy: Training and importing the image classifier with JavaScript proved to be a big challenge. We gathered images through existing datasets and our own images. Handing asynchronous predictions in real-time with the Teachable Machine required optimizing the predictions to reduce overhead.
- Compatibility Requirements: Teachable Machine's library is 4 years old, and calls deprecated functions that Electron doesn't allow; this requires specific HTTP headers and rule manipulation to whitelist Teachable Machine's function calls.
- Arduino Communication: Communicating between the Arduino and the model was challenging; we used the serialport package, but syncing the Arduino reads to asynchronous JS writes was surprisingly unintuitive.
- Lack of construction materials and tools: Building a Proof of Concept without proper support or tooling such as 3d printing required some problem solving.

## Accomplishments that we're proud of
- Integrating Tensorflow.js past the electron security policies.
- Implementing Arduino control through the web app.
- Designing a new style for UI to contribute to the chill mood.

## What we learned
- Convenience vs Control: Teachable Machine made it impressively simple to construct and export a classifier, but we lack manual control to introduce possible optimizations like dropout to improve prediction results.
- Hardware debugging practices: The Arduino messaging library (and maybe the Arduino itself) runs into undefined behavior often, practicing how to reset and flush the Arduino was helpful.
- Desktop Webapp: Implementing web dev skills to build an application through Electron was familiar but also different in unfortunate ways.

## What's next for GarboGotchi
- 3d printing a compatible trashcan
- More skins and cosmetics (paid)
- Mobile version


## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
