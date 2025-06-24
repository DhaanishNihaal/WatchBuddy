import React from 'react'

const Footer = () => {
  return (
    
<footer class="p-4 bg-white bottom-0 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-[#4A154B]">
    <span class="text-sm text-gray-500 sm:text-center dark:text-gray-100">© 2025 <a href="https://flowbite.com/" class="hover:text-[#ECB22E] hover:underline">Developed</a>. by Dhaanish Nihaal
    </span>
    <ul class="flex flex-wrap items-center mt-3 text-sm text-gray-100 dark:text-gray-100 sm:mt-0">
        <li>
            <a href="/" class="mr-4 hover:text-[#ECB22E] hover:underline md:mr-6 ">About</a>
        </li>
        <li>
            <a href="/" class="mr-4 hover:text-[#ECB22E] hover:underline md:mr-6">Privacy Policy</a>
        </li>
        <li>
            <a href="/" class="mr-4 hover:text-[#ECB22E] hover:underline md:mr-6">Licensing</a>
        </li>
        <li>
            <a href="/" class="hover:text-[#ECB22E] hover:underline">Contact</a>
        </li>
    </ul>
</footer>

  )
}

export default Footer