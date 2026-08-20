import { curatedImages } from './curatedImages';

export const coursesContent = {
  seo: {
    title: 'Courses | Mohua Facility Hub',
    description:
      'Sustainable Living Course modules including Permaculture Design, Earth Building, and Organic Growing in Golden Bay.',
  },
  hero: {
    title: 'Course Modules',
    intro:
      'All our courses have closed for this years intake. In the meantime, check out what we offered in 2025.',
  },
  overview: {
    title: 'Sustainable Living Course 2025',
    body: `Once a year we run our Sustainable Living Course: a 7-week series of modules exploring and teaching skills in resilient, holistic and sustainable living.

The modules include and incorporate Permaculture Design Certificate, Earth Building, Organic Vegetable Growing, Organic Orchard Design and Care, and day courses including All About Soil, Homesteading Kitchen Skills, and DIY Natural Home and Body Care.

We have options available to participate in the full course, individual and combined modules, or one day modules and field trips.`,
    closedNote: 'Registrations have now closed, coming again in 2026.',
    quotes: [
      {
        text: 'An awesome awakening to a new way of living. It feels like a paradigm shift that could really benefit anyone who is struggling to create a healthy life.',
        author: 'Ed Thompson, Student 2019',
      },
      {
        text: 'A spectacular course that has enriched my life in numerous ways. I look at the world with hope and motivation and I intend to live with nature.',
        author: 'Jasmin Hales, Student 2019',
      },
    ],
  },
  modules: [
    {
      id: 'earth-building',
      title: 'Earth Building',
      tagline: 'Get dirty, be inspired, build your own, locally resourced',
      body: `In this module you will learn about the health impacts of our modern building methods, why building with natural materials benefits all living systems, and what you can do to bring natural materials back into your home.

By getting your hands and feet in the clay you will learn different earth-building techniques and their properties, and be inspired by the creative possibilities of this material. You will go on field trips to meet the owners of earth-built homes and ecologically integrated properties here in Golden Bay.`,
      tutor: 'Rita Scholten',
      image: curatedImages.courses.earthBuilding,
      status: 'Registrations have now closed, coming again in 2026.',
    },
    {
      id: 'permaculture',
      title: 'Permaculture Design Certificate',
      tagline: "Don't just DO permaculture, BE permaculture!",
      body: `This internationally certified residential Permaculture design course focuses on design as a process. Learn how to transform degraded landscapes into thriving resilient habitats, discover your place within the natural world, and experience community in action.

This course covers the standard two-week international Permaculture Design Certificate curriculum through Earthcare Education Aotearoa, leading into an additional four days of 'inner permaculture' exploration through Deep Ecology and the Work that Reconnects.`,
      locations: ['Tui Treefield', 'Mohua Facility Hub'],
      tutors: ['Robina McCurdy', 'Charles Bradley', 'Inna Alex', 'Sol Morgan'],
      image: curatedImages.courses.permaculture,
      status: 'Coming again in 2026.',
    },
    {
      id: 'organic',
      title: 'Organic Growing and Health Care',
      tagline: 'Be resilient, grow your own, invest in health',
      body: `Learn how to create a vegetable garden and orchard from scratch, following organic principles and utilising local resources as much as possible. In addition, you will gain skills and know-how to produce an abundance of fruit and vegetables throughout the seasons.`,
      tutor: 'Sol Morgan',
      submodules: [
        'Organic Vegetable Growing',
        'Organic Orchard Design and Care',
        'DIY Natural Home and Body Care',
      ],
      image: curatedImages.courses.organic,
      status: 'Registrations have now closed, coming again in 2026.',
    },
    {
      id: 'full-course',
      title: 'Full Sustainability Course',
      tagline: 'Activate yourself, design your future',
      body: `This comprehensive course explores how sustainability can be integrated into your daily life, from personal habits to redesigning your lifestyle for greater food resilience and overall well-being.

Permaculture Design — 19 days. Earth Building — 5 days. Organic Growing and Health Care — 13 days. Each module features field trips, guest speakers, and hands-on practical learning experiences.`,
      duration: '7 weeks, 3 modules',
      image: curatedImages.courses.fullCourse,
      status: 'Coming again in 2026.',
    },
    {
      id: 'day-modules',
      title: 'One Day Modules and Field Trips',
      body: '',
      status: 'Registrations have now closed, coming again in 2026.',
      image: curatedImages.courses.dayModules,
      dayCourses: [
        {
          title: 'All About Soil',
          tutor: 'Sol Morgan',
          description:
            'Learn how soil functions, with biological and chemical processes. Field trip to local dairy farm following sustainable practices.',
        },
        {
          title: 'Homesteading Kitchen Skills',
          tutor: 'Kerryn Easterbrook',
          description:
            'Learn to ferment your own kraut, bake gluten free bread, make apple cider vinegar, and forage for your own pesto.',
        },
        {
          title: 'Create Your Own Household and Care Solutions',
          tutor: 'Rita Scholten',
          description:
            'Use your own herbs and basic ingredients to make daily care products from toothpaste and healing balms to laundry liquid and room sprays.',
        },
      ],
    },
  ],
  tutors: [
    {
      name: 'Sol Morgan',
      role: 'Organic Food Growing',
      bio: 'Avid organic gardener, seed saver, educator and community activist passionate about inspiring people to grow healthy food and treat the environment as a living organism.',
      image: curatedImages.courses.tutors.sol,
    },
    {
      name: 'Robina McCurdy',
      role: 'Permaculture',
      bio: 'Founder of the Institute of Earthcare Education Aotearoa and pioneer of community development, organic growing, and permaculture design on a global scale for the past 35 years.',
      image: curatedImages.courses.tutors.robina,
    },
    {
      name: 'Kerryn Easterbrook',
      role: 'Sustainable Eating',
      bio: 'Passionate about locally sourced, seasonal, organic, great tasting vegetarian food and inspiring people to create nutritious food.',
      image: curatedImages.courses.tutors.kerryn,
    },
    {
      name: 'Rita Scholten',
      role: 'Natural Building / Personal Sustainability',
      bio: 'By building a strawbale house discovered how toxic conventional building materials can be. Loves sharing the empowering experience of building from local sustainable resources.',
      image: curatedImages.courses.tutors.rita,
    },
  ],
};
