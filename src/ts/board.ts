import { reactive, ReactiveObject } from "./core";

export default class Board 
{
    private data:ReactiveObject<{ 
		msg: string 
		isActive : boolean
		isDisabled : boolean
	}> = undefined as any;
	
	private OnclickChangeMsg = () => 
	{
		if(this.data.msg == "Hello")
			this.data.msg = "Goodbye";
		else
			this.data.msg = "Hello";
	}

	private OnclickToggleActive = () => this.data.isActive = !this.data.isActive;

	private OnclickToggleDisabled = () => this.data.isDisabled = !this.data.isDisabled;
    
	constructor() {
		this.data = reactive({
			msg: "Hello",
			isActive: false,
			isDisabled : false
		});
        this.bindWatchers();
        this.bindButtons();
        console.info("Board is instantiate");
    }

	private bindWatchers() {
		this.data.watchMsg((next) => console.log(`MSG changed for ${next}`));
		this.data.watchIsActive((next) => console.log(`isActive changed for ${next}`));
		this.data.watchIsDisabled((next) => console.log(`isDisabled changed for ${next}`));
	}
    
	private bindButtons = () => {
        document.querySelectorAll('button[type="button"][data-binding="board-on-click-change-msg"]')
            ?.forEach(button => 
                button.addEventListener('click', () => this.OnclickChangeMsg()))

		document.querySelectorAll('button[type="button"][data-binding="board-toggle-active"]')
            ?.forEach(button => 
                button.addEventListener('click', () => this.OnclickToggleActive()))
		
		document.querySelectorAll('button[type="button"][data-binding="board-toggle-disabled"]')
            ?.forEach(button => 
                button.addEventListener('click', () => this.OnclickToggleDisabled()))
    }

    public printScore = () => {
		throw new Error("Method not implemented.");
    }
    
}