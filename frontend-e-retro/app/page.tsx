import Banner from './presentation/components/Banner/index';
import Companies from './presentation/components/Companies/Companies';
import Courses from './presentation/components/Courses/index';
import Mentor from './presentation/components/Mentor/index';
import Testimonials from './presentation/components/Testimonials/index';
import Newsletter from './presentation/components/Newsletter/Newsletter';


export default function Home() {
  return (
    <main>
      <Banner />
      <Companies />
      <Courses />
      <Mentor />
      <Testimonials />
      <Newsletter />
    </main>
  )
}
