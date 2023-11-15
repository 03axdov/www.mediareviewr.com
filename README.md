# <a href="https://www.mediareviewr.com/">MediaReviewr</a>

> A social media website dedicated towards different forms of entertainment, such as movies. Sort of like IMDB combined with Facebook.

Built with React for the frontend and Python's Django module for the backend. AWS is used to store uploaded images and Heroku is used to host the website.

What this project taught me:
  - Web Development
    - Django and React
    - NodeJS
    - HTML and CSS
    - Integrating backend and frontend  
  - Working on large scale projects
  - Working with API's
  - Working with databases (PostgresSQL)
  - Working with AWS
  - Hosting websites

The code is definitely a bit messy, though my programming has developed quite a lot since this project. Additionally, the infinite scroll mechanic is currently a bit wonky, causing some points to jump.

# Functionality
## Accounts:
  - Accounts can be created with emails, and users can then log in and log out of their account.
    
https://github.com/03axdov/www.mediareviewr.com/assets/62298758/7bc58a57-311f-4861-8c05-065a26330077

## Posts:
  - Posts can be created so long as a user is logged in to an account.
  - Users can specify what type of media, such as movies, that their post concerns.
  - Posts consist of a title, the title of the concerned media, the rating (from 0% to 100% with increments of 5%) and a body of up to 2000 words.
  - Additionally, posts can have pictures or videos, and users can see when they were posted.
  - Posts can be added to a maximum of 3 groups (explained later), and authors can specify what--if any--streaming services the media can be viewed on (if it's not a game or literature).
  - Posts can be liked or disliked by other users.
  - Other users can add comments to posts, and these can be liked or disliked.
  - Users can save posts, which they will then be able to see in ther 'Saved' feed.

https://github.com/03axdov/www.mediareviewr.com/assets/62298758/ce469a6b-4687-46f9-9d93-3d22e85478b2

## The Homepage:
  - Users can scroll through posts and the feed will update automatically so that the user never reaches the bottom of the page so long as there are unseen posts (known as infinite scroll).
  - The feed can be filtered by media type and by streaming services (filtering by streaming services automatically removes posts concerning literature and games).
  - Users have a watchlist (so long as they have an account), where they can write down notes, such as the titles of movies.
  - Users can see which movies, series, etc. are currently trending (have been posted to the most recently) by clicking on the 'Trending' button.
  - Users can search for post titles, names etc. If the search corresponds with the name of a movie, series etc. the average score will be shown.
  - Users can click on the name at the top right corner of a post in order to search for that media.
  - Additionally, users that interact mainly with particular types of posts, such as movie reviews, will tend to see more of those in their feed.

## Profiles:
  - Users can add info, such as a bio, a status, and a profile picture to their account.
  - User's points (the popularity of their posts), followers, and how many accounts they follow can be seen.
  - User's are put into ranks based on how many points they possess.
  - Additionally, they can add a banner, to add more personality to their profile, and lists, to display their favorite movies, series etc.
  - Users can follow each other. All accounts that a user is following can be seen on the right side of the webpage.
  - Users can join groups that can then be seen on their profile.
  - An account's posts can be seen on their profile. These can be sorted by popularity or by recency.
  - An account's friends can bee seen on their profile.

https://github.com/03axdov/www.mediareviewr.com/assets/62298758/de7bfbb7-23c4-4c2b-a636-72909ad12602

## Groups:
  - Users can create groups, that posts can then be uploaded to.
  - Groups consist of a banner, a picture, a name, and a biography.
  - Groups can allow only posts of a certain type, such as movies, or all posts.

https://github.com/03axdov/www.mediareviewr.com/assets/62298758/d4778dd3-9073-4af9-8ecd-8e6f0d674ca3

  - The posts in a group can be sorted by current popularity, all-time popularity, and recency.
  - The top posters to a group can be seen.
  - There is a 'Create Post' button in all groups, that automatically adds the post to the group.

https://github.com/03axdov/www.mediareviewr.com/assets/62298758/65e97a7d-7c09-44af-b761-6d23d1f42010
