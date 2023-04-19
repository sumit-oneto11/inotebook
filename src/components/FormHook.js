import { useForm } from "react-hook-form";

const FormHook = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm(); 
  const onSubmit = data => console.log(data);
   
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input id="firstName" {...register("firstName", { required: true, maxLength: 20, minLength: 5 }) } aria-invalid={errors.firstName ? "true" : "false"} />
      {errors.firstName && <span>This field is required</span>}
      <input {...register("lastName", {required: true, pattern: /^[A-Za-z]+$/i })} />
      <input type="number" {...register("age", {required: true, min: 18, max: 99 })} />
      <input type="submit" /> 
    </form>
  );
}

export default FormHook;