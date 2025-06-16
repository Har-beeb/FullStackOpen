const Course = ({ course }) => {

    const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    console.log('total exercises for', course.name, '=', total)
    
    return (
      <>
        <h1>{course.name}</h1>
        {course.parts.map(part => (
          <p key={part.id}>
            {part.name} {part.exercises}
          </p>
        ))}
        <strong> 
          total of {total} exercises
        </strong>
      </>
    )
  }

  export default Course