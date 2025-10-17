'use client';
import { Chip, Image } from '@heroui/react';
import React from 'react';

function Review() {
  const testimonials = [
    {
      name: 'Jonathan Yombo',
      title: 'Software Engineer',
      text: 'Tailus is really extraordinary and very practical, no need to break your head. A real gold mine.',
      image: 'https://i.postimg.cc/W1rCvYnT/nazmul-hossain.jpg',
    },
    {
      name: 'Khatab Wedaa',
      title: 'Merakiol Creator',
      text: "Tailus is an elegant, clean, and responsive tailwind css components it's very helpful to start fast with your project.",
      image:
        'https://i.pinimg.com/736x/9f/46/74/9f4674ca9c17330ab419c1b2f5951d9a.jpg',
    },
    {
      name: 'Yves Kakume',
      title: 'GDE - Android',
      text: 'With no experience in webdesign I just redesigned my entire website in a few minutes with tailwindcss thanks to Tailus.',
      image:
        'https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg',
    },
    {
      name: 'Yucel Farukşahan',
      title: 'Creator, Tailkits',
      text: 'Great work on tailfolio template. This is one of the best personal website that I have seen so far :)',
      image:
        'https://i.pinimg.com/736x/6f/a3/6a/6fa36aa2c367da06b2a4c8ae1cf9ee02.jpg',
    },
    {
      name: 'Anonymous author',
      title: 'Doing something',
      text: 'I am really new to Tailwind and I want to give a go to make some page on my own. I searched a lot of hero pages and blocks online. However, most of them are not giving me a clear view or needed some HTML/CSS coding background to make some changes from the original or too expensive to have. I downloaded the copy of Tailus template which is very clear to understand at the last and you could modify the codes/blocks to fit perfectly on your purpose of the page.',
      image:
        'https://i.pinimg.com/1200x/c2/4e/27/c24e271f2f992fd7e62e8c1e8d9b3e2f.jpg',
    },
    {
      name: 'Shekinah Tshikulila',
      title: 'Software Engineer',
      text: 'Tailus is redefining the standard of web design, with these blocks it provides an easy and efficient way for those who love beauty but may lack the time to implement it. I can only recommend this incredible wonder.',
      image:
        'https://i.pinimg.com/736x/81/d6/b1/81d6b158728f5fc97ca6e0a025fefee0.jpg',
    },
    {
      name: 'Zeki',
      title: 'Founder of ChatExtend',
      text: "Using Tailkit!! has been like unlocking a secret design superpower. It's the perfect fusion of simplicity and versatility, enabling us to create UIs that are as stunning as they are user-friendly.",
      image:
        'https://i.pinimg.com/736x/ce/31/42/ce3142d7a968fff3aecd0100572a5e8b.jpg',
    },
    {
      name: 'Eric Ampire',
      title: 'Mobile Engineer ',
      text: 'Tailus templates are the perfect solution for anyone who wants to create a beautiful, functional website without any web design experience. The templates are easy to use, customizable, and responsive, and the support team is always available to help. I highly recommend Tailus templates to anyone who is looking to create a website.',
      image:
        'https://i.pinimg.com/736x/79/63/a5/7963a5246188d408b8f28961a0cf2b90.jpg',
    },
    {
      name: 'Oketa Fred',
      title: 'Fullstack Developer',
      text: 'I absolutely love Tailus! The component blocks are beautifully designed and easy to use, which makes creating a great-looking website a breeze.',
      image:
        'https://i.pinimg.com/736x/57/3c/80/573c80967c9429d0ed0ce32701f85b70.jpg',
    },
    {
      name: 'Rodrigo Aguilar',
      title: 'Creator, TailwindAwesome',
      text: 'I love Tailus ❤️. The component blocks are well-structured, simple to use, and beautifully designed. It makes it really easy to have a good-looking website in no time.',
      image:
        'https://i.pinimg.com/736x/b0/c4/21/b0c421e77cf563962026ade82c90dd5b.jpg',
    },
    {
      name: 'Joseph Kitheka',
      title: 'Fullstack Developer',
      text: 'Tailur has transformed the way I develop web applications. Their extensive collection of UI components, blocks, and templates has significantly accelerated my workflow. The flexibility to customize every aspect allows me to create unique user experiences. Tailus is a game-changer for modern web development!',
      image:
        'https://i.pinimg.com/736x/8e/c1/f8/8ec1f80db272047cedf4c20263114387.jpg',
    },
    {
      name: 'Roland Tubonge',
      title: 'Software Engineer',
      text: 'Tailus is so well designed that even with a very poor knowledge of web design you can do miracles. Let yourself be seduced!',
      image:
        'https://i.pinimg.com/1200x/08/a2/41/08a2413b771b729a9f9df20fa97be52a.jpg',
    },
  ];
  return (
    <section className="flex w-full items-center justify-center">
      <div className="flex w-full max-w-7xl flex-col items-center px-4 py-16 font-sans sm:px-6 lg:px-8">
        <Chip
          data-aos="fade-up"
          color="primary"
          classNames={{
            content:
              'from-primary-600 to-foreground-900 text-nowrap bg-gradient-to-r bg-clip-text sm:text-lg text-medium md:text-xl font-medium text-transparent',
            base: 'p-4 py-6 bg-primary-500/30',
          }}
        >
          Reviews
        </Chip>
        {/* Main Heading */}
        <h1
          data-aos="fade-up"
          className="text-foreground-900 mb-4 max-w-4xl text-center text-4xl font-bold leading-tight sm:text-5xl md:mt-8 lg:text-6xl "
        >
          What Customers Are Saying About Their Experience.
        </h1>

        {/* Subheading */}
        <p
          data-aos="fade-up"
          className="text-foreground-400 mb-16 max-w-3xl text-center text-base sm:text-lg"
        >
          Discover how actual users have revolutionized their workflows using
          the capabilities of our software.
        </p>

        {/* Testimonial Cards Container - Masonry-like layout */}
        <div className="w-full max-w-7xl columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {testimonials.map((testimonial, index) => (
            <div
              data-aos="fade-up"
              key={index}
              className="border-foreground-200 hover:border-primary-200 bg-background break-inside-avoid rounded-xl border p-6 shadow-md"
            >
              <p className="text-foreground-700 text-base leading-relaxed ">
                {testimonial.text}
              </p>
              <div className="mt-4 flex items-center">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="mr-4 size-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-foreground-900 font-semibold ">
                    {testimonial.name}
                  </p>
                  <p className="text-foreground-600 text-sm ">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Review;
