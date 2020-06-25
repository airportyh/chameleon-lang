	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	subq	$40, %rsp
	.cfi_def_cfa_offset 48
	movb	$84, 32(%rsp)
	movb	$72, 33(%rsp)
	movb	$77, 24(%rsp)
	movb	$72, 25(%rsp)
	movzbl	32(%rsp), %edi
	callq	_putchar
	movzbl	33(%rsp), %edi
	movl	%eax, 20(%rsp)          ## 4-byte Spill
	callq	_putchar
	movl	$10, %edi
	movl	%eax, 16(%rsp)          ## 4-byte Spill
	callq	_putchar
	movzbl	24(%rsp), %edi
	movl	%eax, 12(%rsp)          ## 4-byte Spill
	callq	_putchar
	movzbl	25(%rsp), %edi
	movl	%eax, 8(%rsp)           ## 4-byte Spill
	callq	_putchar
	movl	$10, %edi
	movl	%eax, 4(%rsp)           ## 4-byte Spill
	callq	_putchar
	xorl	%ecx, %ecx
	movl	%eax, (%rsp)            ## 4-byte Spill
	movl	%ecx, %eax
	addq	$40, %rsp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
