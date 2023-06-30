import React from "react"

export const AditionalServices = (name, description, price) => {
  return (
    <>
        <tr>
            <td>{name}</td>
            <td>{description}</td>
            <td>{price}</td>
        </tr>
    </>
    )
}