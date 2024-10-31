import AgentCard from "./AgentCard";

function Agents() {
  const testimonial1 =
    "Rinnie has been a game-changer for my organization and efficiency. What used to take hours—sorting through and editing buyer brokerage service agreements with clients—is now a breeze. The process of managing multiple emails and juggling different platforms for signatures was exhausting, but Rinnie simplifies everything. It keeps all my forms organized in one place, and creating new ones is quick and effortless. I couldn’t be happier with the time I’m saving and the ease of use";

  return (
    <div>
      <h1>Agent Testimonials</h1>
      <AgentCard
        name="Meena Dhawan"
        imageSrc="/meena.jpg"
        right={true}
        testimonial={testimonial1}
      />
    </div>
  );
}

export default Agents;
