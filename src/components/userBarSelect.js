import React from 'react';
import '../css/userbar.min.css'

export default function UserBarSelect () {
    return (
        <form className="userbar__select">
            <select>
                <option value="686170fe-72b2-4ce2-9626-0151f4486954">Project 1</option>
                <option value="cafbe6be-633e-4fa8-ae74-86fd8a2a50d5">Project 2</option>
            </select>
        </form>
    )
}