import { University } from "lucide-react";

export default {
  firstName: 'James',
  lastName: 'Carter',
  jobTitle: 'Full Stack Developer',
  address: '525 N Tryon Street, NC 28117',
  phone: '1234567890',
  email: 'example@gmail.com',
  themeColor: '#ff6666',
  summary: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas sit vero tempora. Porro officiis accusantium perferendis! Exercitationem quod nisi, quas nobis fugiat dolorum animi accusantium sed cupiditate tenetur ea ipsa! Eos quae quod, recusandae sequi unde voluptatem numquam? Consectetur, voluptatibus?",
  experience: [
    {
      id: 1,
      title: 'Full Stack Developer',
      companyName: 'Amazon',
      city: 'New York',
      state: 'NY',
      startDate: 'Jan 2021',
      endDate: '',
      currentlyWorking: true,
      workSummary:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas perspiciatis qui minus reiciendis soluta dolorum totam illo itaque quae quas? Labore a ea porro alias laboriosam quidem quaerat, natus eius reiciendis numquam cumque vero, omnis excepturi laborum esse, modi eum minima dolorem. Provident ab dolorum iste amet. Numquam, voluptatibus sunt.',
    },
    {
      id: 2,
      title: 'Frontend Developer',
      companyName: 'Google',
      city: 'San Francisco',
      state: 'CA',
      startDate: 'Jun 2019',
      endDate: 'Dec 2020',
      currentlyWorking: false,
      workSummary:
             'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas perspiciatis qui minus reiciendis soluta dolorum totam illo itaque quae quas? Labore a ea porro alias laboriosam quidem quaerat, natus eius reiciendis numquam cumque vero, omnis excepturi laborum esse, modi eum minima dolorem. Provident ab dolorum iste amet. Numquam, voluptatibus sunt.Built scalable frontend features using React and Redux.',
    },
  ],
  education: [
    {
      id: 1,
      universityName: 'MIT',
      degree: 'BSc',
      major: 'Computer Science',
      city: 'Cambridge',
      state: 'MA',
      startDate: '2015',
      endDate: '2019',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam minus iste ipsa nobis sapiente blanditiis dolor est provident veniam quos?',
    },
  ],
  Skills: [
    {
      id:1,
      name:'React',
      rating:80,
    },
    {
      id:2,
      name:'JavaScript',
      rating:90,
    },
     {
      id:3,
      name:'Python',
      rating:95,
    },
     {
      id:4,
      name:'Java',
      rating:80,
    },
     {
      id:5,
      name:'MySQL',
      rating:90,
    }
  ],
};
