import MovementHero from '../components/Movement/MovementHero'
import MovementVideoSection from '../components/Movement/MovementVideoSection'
import MovementTextSection from '../components/Movement/MovementTextSection'

function MovementPage() {
  // First section
  const heading_first = "Revolutionizing Coffee,\nOne Adventure at a Time.";
  const content_first = [
    "At Movement, we believe true freedom lies in the ability to savor exceptional coffee wherever your journey takes you. Our meticulously crafted portable espresso gadgets are designed to empower you to create barista-quality brews, transcending the limitations of time and place.",
    "Embrace the spirit of exploration with our compact and lightweight designs. Whether you're summiting a mountain peak or simply seeking a moment of tranquility in the city, Movement allows you to indulge your passion for exquisite coffee, on your own terms.",
    "Movement: Where Freedom Meets Flavor."
  ];

  // Second section
  const heading_second = "Our portable espresso gadgets are engineered for simplicity and precision. With just a few steps, you can enjoy rich, barista-quality coffee wherever you are.";
  const content_second = [
    "A Symphony of Simplicity, No Electricity and No Limits: Brew anywhere with our manual, eco-friendly design.",
    "Portability: Compact and lightweight, they effortlessly slip into your backpack, ready for any adventure.",
    "Easy to Use because great coffee should never slow you down."
  ];

  // Third section
  const heading_third = "Why Choose Movement";
  const subheading_third = "For Explorers, By Explorers.";
  const content_third = [
    "Adventure-Ready: Durable, lightweight, and designed for life on the move.",
    "Exceptional Flavor: Brings out the best in every bean, delivering coffee-shop quality anywhere.",
    "Easy to Use because great coffee should never slow you down."
  ];

  return (
    <div>
      <MovementHero/>
      
      {/* Section 1 */}
      <MovementTextSection 
        heading={heading_first}
        content={content_first}
      />
      
      <MovementVideoSection
        desktopVideoUrl="https://ik.imagekit.io/7ujz6ljli/Movement/Movement_Desk_01_1.mp4?updatedAt=1760249904962"
        mobileVideoUrl="https://ik.imagekit.io/7ujz6ljli/Movement/Movement_Desk_01_1.mp4?updatedAt=1760249904962"
        posterUrl="https://ik.imagekit.io/7ujz6ljli/Movement/Movement_Hero-p-1600.png?updatedAt=1760249831197"
        scrollHeight="300vh"
      />
      
      {/* Section 2 */}
      <MovementTextSection 
        heading={heading_second}
        content={content_second}
      />
      
      <MovementVideoSection
        desktopVideoUrl="https://ik.imagekit.io/7ujz6ljli/Movement/Movement_Desk_01_1.mp4?updatedAt=1760249904962"
        mobileVideoUrl="https://ik.imagekit.io/7ujz6ljli/Movement/Movement_Desk_01_1.mp4?updatedAt=1760249904962"
        posterUrl="https://ik.imagekit.io/7ujz6ljli/Movement/Movement_Hero-p-1600.png?updatedAt=1760249831197"
        scrollHeight="300vh"
      />
      
      {/* Section 3 - with subheading */}
      <MovementTextSection 
        heading={`${heading_third}\n${subheading_third}`}
        content={content_third}
      />
    </div>
  )
}

export default MovementPage