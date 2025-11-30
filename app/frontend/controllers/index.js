import { Application } from "@hotwired/stimulus";
import * as Turbo from "@hotwired/turbo";

// Start Turbo
Turbo.start();

// Start Stimulus
const application = Application.start();
application.debug = false;

// Register controllers here as they are created
// application.register("example", ExampleController);

export { application };
