// eventually gonna move this validate function into a separate file
export function validateForm(data) 
{
    // Store all the validation errors in an array
    const errors = [];

    // Validate first name
    if (!data.fname || data.fname.trim() === "") // if doesnt exist or is empty (trim removes whitespace)
    {
        errors.push("first name is required!");
    }

    if (!data.lname || data.lname.trim() === "")
    {
        errors.push("last name is required!")
    }

    if (!data.email || data.email.trim() === "")
    {
        data.email.indexOf("@") === -1 || data.email.indexOf(".") === -1
        errors.push("Email is required and must be valid");
    }

    // validate method (pickup or delivery)
    if (!data.method)
    {
        errors.push("Select pickup or delivery");
    } else 
    {
        const validOptions = [ "pickup", "delivery"];
        if (!validOptions.includes(data.method))
        {
            errors.push("Go away!");
        }
    }

    // validate size
    if (data.size === "none")
        {
            errors.push("please select a size!");
        } else 
        {
            const validSizes = [ "small", "med", "large"];
            if (!validSizes.includes(data.size))
            {
                errors.push("Go away (size)!");
            }
        }

    return  {
        isValid: errors.length === 0,
        errors
    }
}