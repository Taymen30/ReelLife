# Content Sharing Web App(ReelLife) Readme

## Description

This web application enables users to create and share posts, as well as engage in discussions through comments. It is based around the idea of needing a social media platform for people in the fishing community to hopefully make it more popular with the younger generations.

## Screenshots

![img](screenshots/Screenshot%202023-09-29%20at%2010.01.11%20am.png)

## Features

- **User Authentication**: Users can register, log in, and log out securely. Passwords are hashed before being stored.
- **Create and View Posts**: Users can create new posts with titles, images, and descriptions. All existing posts are accessible from the homepage.
- **Comments**: Users can comment on posts. Comments are displayed alongside the respective post.
- **Delete Posts**: Users have the ability to remove their own posts.

## Technologies Used

- **Frontend**: HTML, CSS, EJS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: Bcrypt for password hashing
- **Session Management**: Express Session and MemoryStore
- **Database Access**: Node-postgres (pg)
- **Other Middleware**: Method Override for DELETE and PUT requests

## Getting Started

To get started, simply click on the following  https://reellife-ub15.onrender.com. This will take you directly to the web application where you can explore and interact with the content.

## Future Enhancements

In the future, I plan to implement a few new features to enhance the user experience and functionality of ReelLife. Some of the upcoming additions include:

- **Post Editing**: I aim to allow users to edit their posts, providing the flexibility to update content or correct any mistakes.

- **Comment Editing**: Users will have the ability to edit their comments, ensuring they can refine their contributions.

- **Google Maps Integration**: I plan to add a Google Maps feature to posts, allowing users to specify the location where they made their catch. This will provide a visual representation of the catch location.

- **Like Functionality**: Introducing a "like" feature will enable users to express their appreciation for posts and comments.

- **Advanced CSS Styling**: I am committed to further refining the visual aspects of the application, focusing on providing a seamless and aesthetically pleasing user interface.

Additionally, I plan to implement the **Model-View-Controller (MVC)** architecture to enhance the organization and maintainability of the codebase. This design pattern will help create a more modular and structured application.


