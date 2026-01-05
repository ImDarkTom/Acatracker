# Frontend Tech

## Nuxt (vue-router, pinia)

**Nuxt** includes vue-router and pinia, both of which are used in the frontend for routing and state management.

Relevant files:
- `app/stores`: Contains pinia stores.


## Tailwind CSS

**Tailwind CSS** is used as a CSS replacement. `@tailwindcss/vite` is used for Vite integration.

Relevant files:
- `app/assets/css/main.css`: Core CSS file.


## Reka UI

**Reka UI** is a headless component library for Nuxt, allowing us to use premade ARIA-compliant components.

Relevant files:
- `app/components/custom/`: Contains extended Reka components to reduce duplicated code.


## Nuxt Icon

**Nuxt Icon** is a Nuxt plugin that allows us to easily add icons.


## Nuxt Color Mode

**Nuxt Color Mode** provides an easy way to manage and toggle light/dark mode.


## VeeValidate

**VeeValidate** is used for form validation. Provides Zod integration with `@vee-validate/zod` allowing us to use Zod schemas to validate our forms.

Relevant files:
- `app/components/DynamicForm`