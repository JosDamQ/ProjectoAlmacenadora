import React from "react"

export const User = (name, surname, email, password, phone, rol) => {
  return (
    <>
        <tr>
            <td>{name}</td>
            <td>{surname}</td>
            <td>{email}</td>
            <td>{phone}</td>
            <td>{rol}</td>
        </tr>
    </>
    )
}